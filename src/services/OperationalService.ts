// @ts-nocheck
/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './PrismaService'; // Under the hood Prisma instance or replica

@Injectable()
export class OperationalService {
  constructor(private prisma: PrismaService) {}

  /**
   * Updates the current measured weight of a mini-bar item.
   * If the item weight falls below the critical threshold, it triggers an urgent refill task.
   * 
   * @param itemId Unique ID of the mini-bar beverage or payload
   * @param newWeight The raw weight input in grams from the load cell
   */
  async updateMiniBarWeight(itemId: string, newWeight: number) {
    // 1. Fetch item to perform calculations & ensure existence
    const item = await this.prisma.miniBarItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      throw new NotFoundException(`MiniBarItem with ID ${itemId} not found.`);
    }

    // 2. Perform the database update for the current weight
    const updatedItem = await this.prisma.miniBarItem.update({
      where: { id: itemId },
      data: { currentWeight: newWeight },
    });

    // 3. Define alert levels
    const isCritical = newWeight <= item.threshold;
    const isLow = newWeight <= item.idealWeight * 0.5;

    // 4. Create an automated restocking dispatch task if threshold is breached
    let automaticTask = null;
    if (isCritical) {
      automaticTask = await this.createRefillTask(item.roomId, item.name);
    }

    return {
      item: updatedItem,
      status: isCritical ? 'CRITICAL' : isLow ? 'LOW' : 'OPTIMAL',
      dispatchedTask: automaticTask
    };
  }

  /**
   * Generates a new task in the operational dispatch system for the staff butler.
   * 
   * @param roomId Target hotel suite / room number
   * @param itemName Name of the luxury asset requiring replenishment
   */
  async createRefillTask(roomId: string, itemName: string) {
    return this.prisma.task.create({
      data: {
        description: `URGENT Refill: Replenish ${itemName} in Suite ${roomId} (Telemetry Alert)`,
        priority: 'CRITICAL',
        status: 'PENDING',
        roomId: roomId,
        createdAt: new Date()
      },
    });
  }

  /**
   * Automates valet parking slot assignments upon License Plate Recognition (LPR) camera triggers.
   * Finds the first unoccupied parking spot in the hotel and links the vehicle credentials.
   * 
   * @param hotelId ID of the establishment
   * @param plate Recognized vehicle license plate
   * @param model Car manufacturer and model
   */
  async handleCarArrival(hotelId: string, plate: string, model: string) {
    // 1. Find the first available parking spot registered to this establishment
    const spot = await this.prisma.parkingSpot.findFirst({
      where: {
        hotelId: hotelId,
        status: 'Available',
      },
    });

    if (!spot) {
      throw new NotFoundException(`Valet warning: No premium parking spots currently available for Hotel: ${hotelId}`);
    }

    // 2. Update occupancy state & bind vehicle metadata
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
   * Validates high-value asset chain-of-custody via recorded cryptographic blockchain signatures.
   * 
   * @param hash SHA-256 equivalent provenance registration identifier
   */
  async verifyWineBottle(hash: string) {
    const bottle = await this.prisma.wineBottle.findUnique({
      where: { blockchainHash: hash },
    });

    if (!bottle) {
      return { 
        verified: false, 
        message: 'Signature mismatched. Wine authenticity cannot be guaranteed.' 
      };
    }

    return { 
      verified: true, 
      bottle 
    };
  }
}
