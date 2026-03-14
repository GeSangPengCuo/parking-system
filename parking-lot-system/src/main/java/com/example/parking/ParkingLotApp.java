package com.example.parking;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

class Car {
    private final String plateNumber;
    private final String color;

    Car(String plateNumber, String color) {
        this.plateNumber = plateNumber;
        this.color = color;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public String getColor() {
        return color;
    }

    @Override
    public String toString() {
        return plateNumber + " (" + color + ")";
    }
}

class ParkingSpot {
    private final int number;
    private Car car;
    private LocalDateTime startTime;

    ParkingSpot(int number) {
        this.number = number;
    }

    public int getNumber() {
        return number;
    }

    public boolean isFree() {
        return car == null;
    }

    public Car getCar() {
        return car;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void park(Car car) {
        this.car = car;
        this.startTime = LocalDateTime.now();
    }

    public void leave() {
        this.car = null;
        this.startTime = null;
    }
}

class ParkingLot {
    private final List<ParkingSpot> spots;
    private final double pricePerHour;

    ParkingLot(int capacity, double pricePerHour) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive.");
        }
        this.pricePerHour = pricePerHour;
        this.spots = new ArrayList<>();
        for (int i = 1; i <= capacity; i++) {
            spots.add(new ParkingSpot(i));
        }
    }

    public boolean hasFreeSpot() {
        return spots.stream().anyMatch(ParkingSpot::isFree);
    }

    public ParkingSpot park(Car car) {
        for (ParkingSpot spot : spots) {
            if (spot.isFree()) {
                spot.park(car);
                return spot;
            }
        }
        return null;
    }

    public double leave(String plateNumber) {
        for (ParkingSpot spot : spots) {
            if (!spot.isFree() && spot.getCar().getPlateNumber().equalsIgnoreCase(plateNumber)) {
                LocalDateTime endTime = LocalDateTime.now();
                LocalDateTime startTime = spot.getStartTime();
                long minutes = java.time.Duration.between(startTime, endTime).toMinutes();
                double hours = Math.max(1, Math.ceil(minutes / 60.0));
                double fee = hours * pricePerHour;
                spot.leave();
                return fee;
            }
        }
        return -1;
    }

    public void printStatus() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        System.out.println("====== 当前停车场状态 ======");
        for (ParkingSpot spot : spots) {
            if (spot.isFree()) {
                System.out.printf("车位 %d: 空闲%n", spot.getNumber());
            } else {
                String timeStr = spot.getStartTime().format(formatter);
                System.out.printf("车位 %d: %s 入场时间: %s%n",
                        spot.getNumber(),
                        spot.getCar(),
                        timeStr);
            }
        }
        long freeCount = spots.stream().filter(ParkingSpot::isFree).count();
        System.out.printf("总车位: %d, 空闲: %d, 已用: %d%n", spots.size(), freeCount, spots.size() - freeCount);
        System.out.println("==========================");
    }

    public void findByPlate(String plateNumber) {
        for (ParkingSpot spot : spots) {
            if (!spot.isFree() && spot.getCar().getPlateNumber().equalsIgnoreCase(plateNumber)) {
                System.out.printf("车牌 %s 在车位 %d%n", plateNumber, spot.getNumber());
                return;
            }
        }
        System.out.printf("未找到车牌为 %s 的车辆%n", plateNumber);
    }
}

public class ParkingLotApp {

    private static int readInt(Scanner scanner, String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine();
            try {
                int value = Integer.parseInt(line.trim());
                if (value < min || value > max) {
                    System.out.printf("请输入 %d 到 %d 之间的数字！%n", min, max);
                } else {
                    return value;
                }
            } catch (NumberFormatException e) {
                System.out.println("输入无效，请重新输入数字。");
            }
        }
    }

    private static double readDouble(Scanner scanner, String prompt, double min) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine();
            try {
                double value = Double.parseDouble(line.trim());
                if (value < min) {
                    System.out.printf("请输入大于等于 %.2f 的数字！%n", min);
                } else {
                    return value;
                }
            } catch (NumberFormatException e) {
                System.out.println("输入无效，请重新输入数字（可以有小数）。");
            }
        }
    }

    private static void printMenu() {
        System.out.println();
        System.out.println("===== 停车场管理系统 =====");
        System.out.println("1. 车辆入场");
        System.out.println("2. 车辆离场并结算");
        System.out.println("3. 查看停车场状态");
        System.out.println("4. 按车牌号查询");
        System.out.println("0. 退出系统");
        System.out.println("========================");
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("欢迎使用简易停车场管理系统！");
        int capacity = readInt(scanner, "请输入停车场车位总数（例如 10）: ", 1, 10000);
        double pricePerHour = readDouble(scanner, "请输入每小时收费金额（例如 5.0）: ", 0.0);

        ParkingLot parkingLot = new ParkingLot(capacity, pricePerHour);

        while (true) {
            printMenu();
            int choice = readInt(scanner, "请选择操作：", 0, 4);

            switch (choice) {
                case 1 -> {
                    if (!parkingLot.hasFreeSpot()) {
                        System.out.println("停车场已满，无法继续停车！");
                        break;
                    }
                    System.out.print("请输入车牌号：");
                    String plate = scanner.nextLine().trim();
                    System.out.print("请输入车辆颜色：");
                    String color = scanner.nextLine().trim();

                    Car car = new Car(plate, color);
                    ParkingSpot spot = parkingLot.park(car);
                    if (spot != null) {
                        System.out.printf("停车成功，您的车位号为：%d%n", spot.getNumber());
                    } else {
                        System.out.println("停车失败，没有可用车位。");
                    }
                }
                case 2 -> {
                    System.out.print("请输入要离场车辆的车牌号：");
                    String plate = scanner.nextLine().trim();
                    double fee = parkingLot.leave(plate);
                    if (fee < 0) {
                        System.out.println("未找到该车牌的车辆，离场失败。");
                    } else {
                        System.out.printf("离场成功，应支付停车费：%.2f 元%n", fee);
                    }
                }
                case 3 -> parkingLot.printStatus();
                case 4 -> {
                    System.out.print("请输入要查询的车牌号：");
                    String plate = scanner.nextLine().trim();
                    parkingLot.findByPlate(plate);
                }
                case 0 -> {
                    System.out.println("感谢使用，系统即将退出。");
                    scanner.close();
                    return;
                }
                default -> System.out.println("未知选项，请重新选择。");
            }
        }
    }
}

