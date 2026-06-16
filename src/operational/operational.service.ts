// @ts-nocheck
/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // On suppose que vous avez un PrismaService global

@Injectable()
export class OperationalService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gère la mise à jour du poids d'un article de mini-bar
   * Retourne un objet contenant l'état et si une alerte doit être déclenchée
   */
  async updateMiniBarWeight(itemId: string, newWeight: number) {
    // 1. Mise à jour du poids dans la base de données
    const item = await this.prisma.miniBarItem.update({
      where: { id: itemId },
      data: { currentWeight: newWeight },
    });

    // 2. Vérification du seuil critique
    const isCritical = item.currentWeight <= item.threshold;
    const isLow = item.currentWeight <= item.idealWeight * 0.5; // Exemple : Alerte si < 50%

    // 3. Si c'est critique, on crée automatiquement une tâche de réapprovisionnement
    if (isCritical) {
      await this.createRefillTask(item.roomId, item.name);
    }

    return {
      item,
      status: isCritical ? 'CRITICAL' : isLow ? 'LOW' : 'OPTIMAL',
    };
  }

  /**
   * Crée une tâche de maintenance/réapprovisionnement
   */
  async createRefillTask(roomId: string, itemName: string) {
    return this.prisma.task.create({
      data: {
        description: `Refill needed: ${itemName} in Room ${roomId}`,
        priority: 'URGENT',
        status: 'PENDING',
        roomId: roomId,
      },
    });
  }

  /**
   * Gère l'arrivée d'une voiture via LPR (License Plate Recognition)
   */
  async handleCarArrival(hotelId: string, plate: string, model: string) {
    // 1. Chercher la première place disponible dans l'hôtel
    const spot = await this.prisma.parkingSpot.findFirst({
      where: {
        hotelId: hotelId,
        status: 'Available',
      },
    });

    if (!spot) throw new NotFoundException('No parking spots available');

    // 2. Assigner la voiture à la place
    return this.prisma.parkingSpot.update({
      where: { id: spot.id },
      data: {
        status: 'Occupied',
        carPlate: plate,
        carModel: model,
      },
    });
  }

  /**
   * Vérifie l'authenticité d'une bouteille via son hash Blockchain
   */
  async verifyWineBottle(hash: string) {
    const bottle = await this.prisma.wineBottle.findUnique({
      where: { blockchainHash: hash },
    });

    if (!bottle) return { verified: false, message: 'Bottle not found in blockchain' };
    return { verified: true, bottle };
  }
}
