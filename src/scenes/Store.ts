
import { ERAS } from "../data/EraData";
import { PlayerInventory } from "../types/Inventory";

interface StoreProduct {
    id: string;
    name: string;
    priceCheese: number;
    priceBlankets: number;
    description: string;
    icon: string;
    image: string;
    requiredItem?: "shears" | "milkBucket";
    minSheep?: number;
}

export default class Store extends Phaser.Scene {
    // UI references.
    private background!: Phaser.GameObjects.Image;
    private storePanel!: Phaser.GameObjects.Container;
    private closeButton!: Phaser.GameObjects.Text;

    private currentEraIndex = 0;

    // Shared player inventory.
    private playerInventory!: PlayerInventory;

    // Store product definitions.
    private products: StoreProduct[] = [
        {
            id: "shears",
            name: "CESOIE",
            priceCheese: 0,
            priceBlankets: 0,
            description: "Per tosare le pecore",
            icon: "icon_cesoie_N1",
            image: "icon_cesoie_N1"
        },
        {
            id: "milkBucket",
            name: "SECCHI",
            priceCheese: 0,
            priceBlankets: 2,
            description: "Per mungere le pecore",
            icon: "U",
            image: "secchio_N1"
        },
        {
            id: "advancedShears",
            name: "CESOIE AVANZATE",
            priceCheese: 1,
            priceBlankets: 1,
            description: "Cesoie piu veloci",
            icon: "X+",
            image: "icon_cesoie_N2",
            requiredItem: "shears"
        },
        {
            id: "advancedMilkBucket",
            name: "SECCHIO AVANZATO",
            priceCheese: 1,
            priceBlankets: 2,
            description: "Secchi piu capienti",
            icon: "U+",
            image: "secchio_N2",
            requiredItem: "milkBucket"
        },
        {
            id: "sheep",
            name: "PECORA",
            priceCheese: 3,
            priceBlankets: 2,
            description: "Nuova pecora da fattoria",
            icon: "P",
            image: "pecora"
        },
        {
            id: "blackSheep",
            name: "PECORA NERA",
            priceCheese: 0,
            priceBlankets: 0,
            description: "Pecora speciale e rara",
            icon: "PN",
            minSheep: 5,
            image: "nera"
        }
    ];

    // Properties used to manage the ESC key.
    private escKey?: Phaser.Input.Keyboard.Key;
    private escKeyListener?: () => void;

    constructor() {
        super({ key: "Store" });
    }

    init(): void {
        console.log("Store.init() - Inizializzazione Store");

        const savedEraIndex = this.registry.get("eraIndex");

        if (
            typeof savedEraIndex === "number" &&
            Number.isInteger(savedEraIndex)
        ) {
            this.currentEraIndex = Phaser.Math.Clamp(
                savedEraIndex,
                0,
                ERAS.length - 1
            );
        }

        this.addEraProduct();
        this.loadInventoryFromRegistry();
    }

    private addEraProduct(): void {
        this.products = this.products.filter(
            product =>
                product.id !== "nextEra" &&
                product.id !== "blackSheep"
        );

        if (this.currentEraIndex < ERAS.length - 1) {
            this.products.push({
                id: "nextEra",
                name: "PROSSIMA ERA",
                priceCheese: 4,
                priceBlankets: 6,
                description: `Sblocca: ${ERAS[this.currentEraIndex + 1].name}`,
                icon: "ERA",
                image: "old-nuraghe"
            });
        } else {
            this.products.push({
                id: "blackSheep",
                name: "PECORA NERA",
                priceCheese: 4,
                priceBlankets: 6,
                description: "Pecora speciale e rara",
                icon: "PN",
                minSheep: 5,
                image: "nera"
            });
        }
    }

    preload(): void {
        // The store background is loaded centrally through GameData.
    }

    create(): void {
        console.log("Store.create() - Costruzione interfaccia Store");

        const { width, height } = this.cameras.main;

        // Background showing the Sardinian town.
        this.background = this.add.image(0, 0, "store_bg");
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(width, height);

        // Light overlay for additional contrast.
        const overlay = this.add.rectangle(
            0, 0, width, height, 0x000000, 0.2
        );
        overlay.setOrigin(0, 0);
        overlay.setInteractive();

        // Main store container.
        this.storePanel = this.add.container(
            width / 2,
            height / 2
        );

        // Main panel background.
        const panelBg = this.add.rectangle(
            0, 0,
            width * 0.85,
            height * 0.8,
            0xe8e8e8,
            0.35
        );
        panelBg.setStrokeStyle(6, 0x8b8b8b, 0.6);
        this.storePanel.add(panelBg);

        // Inner border.
        const innerBorder = this.add.rectangle(
            0, 0,
            width * 0.82,
            height * 0.77,
            0xffffff,
            0.2
        );
        innerBorder.setStrokeStyle(3, 0xcccccc, 0.5);
        this.storePanel.add(innerBorder);

        // Frosted-glass effect.
        this.createGlassEffect(
            width * 0.82,
            height * 0.77
        );

        // Store title.
        const title = this.add.text(
            0,
            -height * 0.35,
            "NEGOZIO SA PECORA NIEDDA",
            {
                fontSize: "36px",
                fontFamily: "Early_GameBoy",
                color: "#4fa4c1",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 6
            }
        );

        title.setOrigin(0.5);
        this.storePanel.add(title);

        // Subtitle.
        const subtitle = this.add.text(
            0,
            -height * 0.30,
            "Baratta formaggio e coperte",
            {
                fontSize: "18px",
                fontFamily: "Early_GameBoy",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }
        );

        subtitle.setOrigin(0.5);
        this.storePanel.add(subtitle);

        // Player inventory display.
        this.createInventoryDisplay();

        // Product grid.
        this.createProductGrid();

        // Close button.
        this.closeButton = this.add.text(
            width * 0.38,
            -height * 0.35,
            "X",
            {
                fontSize: "32px",
                fontFamily: "Early_GameBoy",
                color: "#4fa4c1",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 6
            }
        );

        this.closeButton.setOrigin(0.5);
        this.closeButton.setInteractive({ useHandCursor: true });

        this.closeButton.on("pointerdown", () => this.closeStore());

        this.closeButton.on("pointerover", () => {
            this.closeButton.setScale(1.2);
        });

        this.closeButton.on("pointerout", () => {
            this.closeButton.setScale(1);
        });

        this.storePanel.add(this.closeButton);

        // Bottom instructions.
        const instructions = this.add.text(
            0,
            height * 0.34,
            "ESC per uscire",
            {
                fontSize: "16px",
                fontFamily: "Early_GameBoy",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 3
            }
        );

        instructions.setOrigin(0.5);
        this.storePanel.add(instructions);

        // ESC key.
        this.escKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        this.escKeyListener = () => this.closeStore();
        this.escKey.on("down", this.escKeyListener);
    }

    private createGlassEffect(
        panelWidth: number,
        panelHeight: number
    ): void {
        const graphics = this.add.graphics();

        // White dots.
        graphics.fillStyle(0xffffff, 0.12);

        for (let i = 0; i < 400; i++) {
            const x = (Math.random() - 0.5) * panelWidth;
            const y = (Math.random() - 0.5) * panelHeight;
            const size = Math.random() * 3 + 1;

            graphics.fillCircle(x, y, size);
        }

        // Thin decorative lines.
        graphics.lineStyle(1, 0xffffff, 0.08);

        for (let i = 0; i < 30; i++) {
            const x1 = (Math.random() - 0.5) * panelWidth;
            const y1 = (Math.random() - 0.5) * panelHeight;
            const x2 = x1 + (Math.random() - 0.5) * 50;
            const y2 = y1 + (Math.random() - 0.5) * 50;

            graphics.lineBetween(x1, y1, x2, y2);
        }

        this.storePanel.add(graphics);
    }

    private createInventoryDisplay(): void {
        const { width, height } = this.cameras.main;

        const inventoryBg = this.add.rectangle(
            0,
            -height * 0.24,
            width * 0.75,
            60,
            0xd4d4d4,
            0.45
        );

        inventoryBg.setStrokeStyle(3, 0x8b8b8b, 0.6);
        this.storePanel.add(inventoryBg);

        const inventoryText = this.add.text(
            0,
            -height * 0.24,
            this.getInventoryDisplayText(),
            {
                fontSize: "20px",
                fontFamily: "Early_GameBoy",
                color: "#ffff00",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 4
            }
        );

        inventoryText.setOrigin(0.5);
        inventoryText.setName("inventoryDisplay");
        this.storePanel.add(inventoryText);
    }

    private getInventoryDisplayText(): string {
        return `FORMAGGIO: ${this.playerInventory.cheese}   COPERTE: ${this.playerInventory.blankets}   PECORE: ${this.playerInventory.sheep}`;
    }

    private createProductGrid(): void {
        const { width, height } = this.cameras.main;

        const startY = -height * 0.12;
        const spacing = 115;

        this.products.forEach((product, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;

            const x = col === 0
                ? -width * 0.22
                : width * 0.22;

            const y = startY + row * spacing;

            this.createProductCard(product, x, y);
        });
    }

    private createProductCard(
        product: StoreProduct,
        x: number,
        y: number
    ): void {
        const cardWidth = this.cameras.main.width * 0.38;
        const cardHeight = 100;

        // Card container.
        const card = this.add.container(x, y);

        const cardBg = this.add.rectangle(
            0, 0,
            cardWidth,
            cardHeight,
            0xc8b89a,
            0.5
        );
        cardBg.setStrokeStyle(3, 0x6b6b6b, 0.7);
        card.add(cardBg);

        const cardBorder = this.add.rectangle(
            0, 0,
            cardWidth - 6,
            cardHeight - 6,
            0xffffff,
            0.2
        );
        cardBorder.setStrokeStyle(2, 0xaaaaaa, 0.5);
        card.add(cardBorder);

        // Product icon.
        const icon = this.add.image(-210, 0, product.image);
        icon.setDisplaySize(70, 70);
        icon.setOrigin(0.5, 0.5);
        card.add(icon);

        // Product name.
        const nameText = this.add.text(
            -cardWidth / 2 + 70,
            -25,
            product.name,
            {
                fontSize: "18px",
                fontFamily: "Early_GameBoy",
                color: "#4fa4c1",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 4
            }
        );
        card.add(nameText);

        // Description.
        const descText = this.add.text(
            -cardWidth / 2 + 70,
            0,
            product.description,
            {
                fontSize: "12px",
                fontFamily: "Early_GameBoy",
                color: "#2c2c2c",
                stroke: "#ffffff",
                strokeThickness: 2
            }
        );
        card.add(descText);

        // Price.
        let priceStr = "";

        if (
            product.priceCheese === 0 &&
            product.priceBlankets === 0
        ) {
            priceStr = "GRATIS";
        } else {
            const parts: string[] = [];

            if (product.priceCheese > 0) {
                parts.push(`${product.priceCheese}F`);
            }

            if (product.priceBlankets > 0) {
                parts.push(`${product.priceBlankets}C`);
            }

            priceStr = parts.join("+");
        }

        const priceText = this.add.text(
            -cardWidth / 2 + 70,
            18,
            priceStr,
            {
                fontSize: "16px",
                fontFamily: "Early_GameBoy",
                color: "#228b22",
                fontStyle: "bold",
                stroke: "#ffffff",
                strokeThickness: 2
            }
        );
        card.add(priceText);

        // Purchase button.
        const buyButton = this.add.rectangle(
            cardWidth / 2 - 45,
            0,
            80,
            30,
            0x228b22,
            0.85
        );

        buyButton.setStrokeStyle(3, 0x000000);
        buyButton.setInteractive({ useHandCursor: true });

        const buyText = this.add.text(
            cardWidth / 2 - 45,
            0,
            "COMPRA",
            {
                fontSize: "14px",
                fontFamily: "Early_GameBoy",
                color: "#ffffff",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 3
            }
        );

        buyText.setOrigin(0.5);

        buyButton.on("pointerover", () => {
            buyButton.setScale(1.1);
            buyText.setScale(1.1);
        });

        buyButton.on("pointerout", () => {
            buyButton.setScale(1);
            buyText.setScale(1);
        });

        buyButton.on("pointerdown", () => {
            this.purchaseProduct(product);
        });

        card.add(buyButton);
        card.add(buyText);

        this.storePanel.add(card);
    }

    private purchaseProduct(product: StoreProduct): void {
        // Check item requirements.
        if (
            product.requiredItem === "shears" &&
            this.playerInventory.shearsLevel < 1
        ) {
            this.showMessage("SERVE CESOIE BASE!", 0xff0000);
            return;
        }

        if (
            product.requiredItem === "milkBucket" &&
            this.playerInventory.milkBucketLevel < 1
        ) {
            this.showMessage("SERVE SECCHI BASE!", 0xff0000);
            return;
        }

        // Check minimum sheep count.
        if (
            product.minSheep !== undefined &&
            this.playerInventory.sheep < product.minSheep
        ) {
            this.showMessage(
                `SERVONO ${product.minSheep} PECORE!`,
                0xff0000
            );
            return;
        }

        // Check available resources.
        if (
            this.playerInventory.cheese <
            product.priceCheese
        ) {
            this.showMessage(
                "FORMAGGIO INSUFFICIENTE!",
                0xff0000
            );
            return;
        }

        if (
            this.playerInventory.blankets <
            product.priceBlankets
        ) {
            this.showMessage(
                "COPERTE INSUFFICIENTI!",
                0xff0000
            );
            return;
        }

        // Complete purchase.
        this.playerInventory.cheese -= product.priceCheese;
        this.playerInventory.blankets -= product.priceBlankets;

        // Add purchased item.
        switch (product.id) {
            case "shears":
                this.playerInventory.shearsLevel = 1;
                break;

            case "advancedShears":
                this.playerInventory.shearsLevel = 2;
                break;

            case "milkBucket":
                this.playerInventory.milkBucketLevel = 1;
                break;

            case "advancedMilkBucket":
                this.playerInventory.milkBucketLevel = 2;
                break;

            case "sheep":
                this.playerInventory.sheep += 1;
                break;

            case "blackSheep":
                this.playerInventory.blackSheep += 1;
                this.playerInventory.sheep += 1;
                this.registry.set("victory", true);
                break;

            case "nextEra":
                break;
        }

        // Save shared inventory.
        this.saveInventoryToRegistry();

        // Update inventory display.
        this.updateInventoryDisplay();

        // Success message.
        this.showMessage(
            `${product.name} ACQUISTATO!`,
            0x00ff00
        );

        if (product.id === "blackSheep") {
            this.scene.stop("GamePlay");
            this.scene.stop("Hud");
            this.scene.start("Victory");
            return;
        }

        if (product.id === "nextEra") {
            this.closeStore();

            this.scene
                .get("GamePlay")
                .events.emit("eraPurchaseCompleted");

            return;
        }

        // Purchase sound.
        if (this.sound.get("purchase")) {
            this.sound.play("purchase", { volume: 0.5 });
        }
    }

    private updateInventoryDisplay(): void {
        const inventoryDisplay = this.storePanel.getByName(
            "inventoryDisplay"
        ) as Phaser.GameObjects.Text;

        if (inventoryDisplay) {
            inventoryDisplay.setText(
                this.getInventoryDisplayText()
            );
        }
    }

    private showMessage(text: string, color: number): void {
        const { width, height } = this.cameras.main;

        const messageBg = this.add.rectangle(
            width / 2,
            height * 0.12,
            text.length * 14,
            60,
            color
        );

        messageBg.setStrokeStyle(4, 0x000000);
        messageBg.setDepth(1001);

        const message = this.add.text(
            width / 2,
            height * 0.12,
            text,
            {
                fontSize: "24px",
                fontFamily: "Early_GameBoy",
                color: "#ffffff",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 5
            }
        );

        message.setOrigin(0.5);
        message.setDepth(1002);

        this.tweens.add({
            targets: [messageBg, message],
            alpha: 0,
            y: "-=30",
            duration: 1500,
            ease: "Power2",
            onComplete: () => {
                messageBg.destroy();
                message.destroy();
            }
        });
    }

    private loadInventoryFromRegistry(): void {
        const saved = this.registry.get("playerInventory");

        if (!saved || typeof saved !== "object") {
            console.error(
                "Player inventory not found in registry."
            );
            return;
        }

        // Use the same inventory object as GamePlay.
        this.playerInventory = saved as PlayerInventory;
    }

    private saveInventoryToRegistry(): void {
        this.registry.set(
            "playerInventory",
            this.playerInventory
        );

        this.events.emit(
            "inventoryUpdated",
            this.playerInventory
        );
    }

    private closeStore(): void {
        console.log("Store.closeStore() - Chiusura store");

        // Remove ESC listener.
        if (this.escKey && this.escKeyListener) {
            this.escKey.off(
                "down",
                this.escKeyListener
            );

            this.input.keyboard!.removeKey(this.escKey);

            this.escKey = undefined;
            this.escKeyListener = undefined;
        }

        // Resume GamePlay if paused.
        if (this.scene.isPaused("GamePlay")) {
            this.scene.setVisible(true, "Hud");
            this.scene.resume("GamePlay");
        }

        // Close store.
        this.scene.setVisible(true, "Hud");
        this.scene.stop("Store");
    }
}
