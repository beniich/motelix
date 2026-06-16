// @ts-nocheck
/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { 
  WebSocketGateway, 
  SubscribeMessage, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OperationalService } from '../operational/operational.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // À restreindre en production
  },
})
export class CommandGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('CommandGateway');

  constructor(private operationalService: OperationalService) {} // Injection du service

  // 1. Gestion de la connexion
  handleConnection(client: Socket) {
    const hotelId = client.handshake.query.hotelId as string;
    
    if (!hotelId) {
      this.logger.error(`Client connected without hotelId: ${client.id}`);
      client.disconnect();
      return;
    }

    // Le client rejoint un canal spécifique à son hôtel (Isolation Multitenant)
    client.join(`hotel_${hotelId}`);
    this.logger.log(`Client ${client.id} joined hotel channel: ${hotelId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // 2. Évènement : Mise à jour du poids du Mini-Bar (Envoyé par le capteur IoT)
  @SubscribeMessage('sensor_update')
  async handleSensorUpdate(client: Socket, payload: { 
    hotelId: string, 
    roomId: string, 
    itemId: string, 
    newWeight: number 
  }) {
    try {
      // Appel au service pour traiter la donnée et mettre à jour la DB
      const result = await this.operationalService.updateMiniBarWeight(payload.itemId, payload.newWeight);

      // Diffusion de l'alerte en temps réel vers le Dashboard de l'hôtel
      this.server.to(`hotel_${payload.hotelId}`).emit('minibar_alert', {
        roomId: payload.roomId,
        itemId: payload.itemId,
        status: result.status,
        weight: payload.newWeight,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Error updating sensor: ${error.message}`);
    }
  }

  // 3. Évènement : Mise à jour d'une tâche par le staff
  @SubscribeMessage('task_update')
  async handleTaskUpdate(client: Socket, payload: { 
    hotelId: string, 
    taskId: string, 
    status: string 
  }) {
    // Diffuser la mise à jour du statut de la tâche à l'équipe
    this.server.to(`hotel_${payload.hotelId}`).emit('staff_task_sync', {
      taskId: payload.taskId,
      status: payload.status,
      updatedBy: client.id
    });
  }

  // 4. Évènement : Nouvelle voiture détectée (LPR)
  @SubscribeMessage('lpr_detection')
  async handleLPR(client: Socket, payload: { 
    hotelId: string, 
    plate: string, 
    model: string 
  }) {
    try {
      const assignedSpot = await this.operationalService.handleCarArrival(
        payload.hotelId, 
        payload.plate, 
        payload.model
      );

      this.server.to(`hotel_${payload.hotelId}`).emit('parking_arrival', {
        plate: payload.plate,
        spot: assignedSpot.spotNumber,
        model: assignedSpot.carModel,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.server.to(`hotel_${payload.hotelId}`).emit('parking_error', {
        message: 'Parking Full',
        plate: payload.plate,
      });
    }
  }
}
