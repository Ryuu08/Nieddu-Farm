export default class Laboratory extends Phaser.Scene {
    private background!: Phaser.GameObjects.Image;
    private panel!: Phaser.GameObjects.Container;

    private inventoryText!: Phaser.GameObjects.Text;
    private messageText?: Phaser.GameObjects.Text;
    private messageBg?: Phaser.GameObjects.Rectangle;

    // The inventory is managed by GamePlay.
    public playerInventory: any;

    constructor() {
        super({ key: "Laboratory" });
    }

    init(): void {
        // Copy the data from the registry when entering the scene.
        const saved = this.registry.get("playerInventory");
        if (saved) {
            this.playerInventory = { ...saved };
        } else {
            // Use a fallback when no inventory exists yet.
            this.playerInventory = {
                formaggio: 0,
                coperte: 0,
                lana: 0,
                latte: 0,
                cesoie: 0,
                secchi: 0,
                pecore: 0,
                pecoreNere: 0,
            };
        }
    }

    preload(): void {
        // The store background is loaded centrally through GameData.
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Background
        this.background = this.add.image(0, 0, "store_bg").setOrigin(0, 0);
        this.background.setDisplaySize(width, height);

        // Light overlay.
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.18).setOrigin(0, 0);
        overlay.setInteractive();

        // Glass panel.
        this.panel = this.add.container(width / 2, height / 2);

        const panelBg = this.add.rectangle(0, 0, width * 0.85, height * 0.8, 0xe8e8e8, 0.32);
        panelBg.setStrokeStyle(6, 0x8b8b8b, 0.55);
        this.panel.add(panelBg);

        const inner = this.add.rectangle(0, 0, width * 0.82, height * 0.77, 0xffffff, 0.18);
        inner.setStrokeStyle(3, 0xcccccc, 0.45);
        this.panel.add(inner);

        this.createGlassEffect(width * 0.82, height * 0.77);

        // Title.
        const title = this.add.text(0, -height * 0.35, "LABORATORIO", {
            fontFamily: "Early_GameBoy",
            fontSize: "46px",
            color: "#4fa4c1",
            stroke: "#000000",
            strokeThickness: 6,
        }).setOrigin(0.5);
        this.panel.add(title);
        
    

        const subtitle = this.add.text(0, -height * 0.30, "Produzione: formaggio e coperte", {
            fontFamily: "Early_GameBoy",
            fontSize: "18px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
        }).setOrigin(0.5);
        this.panel.add(subtitle);

        // Inventory.
        const invBg = this.add.rectangle(0, -height * 0.24, width * 0.75, 60, 0xd4d4d4, 0.42);
        invBg.setStrokeStyle(3, 0x8b8b8b, 0.6);
        this.panel.add(invBg);

        this.inventoryText = this.add.text(0, -height * 0.24, "", {
            fontFamily: "Early_GameBoy",
            fontSize: "20px",
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 4,
        }).setOrigin(0.5);
        this.panel.add(this.inventoryText);
        this.refreshInventoryText();

        // Production cards.
        const cardY = -height * 0.06;

        this.createProductionCard({
            title: "FORMAGGIO",
            description: "Consuma 2 latte",
            costLabel: "2 LATTE",
            rewardLabel: "+1 FORMAGGIO",
            costicon : 'nera',
            x: -width * 0.22,
            y: cardY,
            iconKey: "icon_cesoie_N2",
            onProduce: () => this.produceCheese(),
        });

        this.createProductionCard({
            title: "COPERTA",
            description: "Consuma 1 lana",
            costLabel: "1 LANA",
            rewardLabel: "+1 COPERTA",
            costicon : 'secchio_R2',
            x: width * 0.22,
            y: cardY,
            iconKey: "icon_cesoie_N1",
            onProduce: () => this.produceBlanket(),
        });

        // Close button.
        const closeButton = this.add.text(width * 0.38, -height * 0.35, "X", {
            fontFamily: "Early_GameBoy",
            fontSize: "32px",
            color: "#4fa4c1",
            stroke: "#000000",
            strokeThickness: 6,
        }).setOrigin(0.5);

        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on("pointerdown", () => this.close());
        closeButton.on("pointerover", () => closeButton.setScale(1.2));
        closeButton.on("pointerout", () => closeButton.setScale(1));
        this.panel.add(closeButton);

        // Instructions.
        const instructions = this.add.text(0, height * 0.34, "ESC per uscire", {
            fontFamily: "Early_GameBoy",
            fontSize: "16px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
        }).setOrigin(0.5);
        this.panel.add(instructions);

        // Press ESC to exit.
        const esc = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        esc.on("down", () => this.close());
    }

    private createProductionCard(params: {
        title: string;
        description: string;
        costLabel: string;
        rewardLabel: string;
        costicon :string,
        x: number;
        y: number;
        iconKey?: string;
        onProduce: () => void;
    }): void {
        const { width } = this.cameras.main;
        const cardWidth = width * 0.38;
        const cardHeight = 140;

        const card = this.add.container(params.x, params.y);

        const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0xc8b89a, 0.5);
        bg.setStrokeStyle(3, 0x6b6b6b, 0.7);
        card.add(bg);

        const inner = this.add.rectangle(0, 0, cardWidth - 6, cardHeight - 6, 0xffffff, 0.18);
        inner.setStrokeStyle(2, 0xaaaaaa, 0.5);
        card.add(inner);

        const title = this.add.text(-cardWidth / 2 + 20, -45, params.title, {
            fontFamily: "Early_GameBoy",
            fontSize: "20px",
            color: "#4fa4c1",
            stroke: "#000000",
            strokeThickness: 2.5,
        });
        card.add(title);

        const desc = this.add.text(-cardWidth / 2 + 20, -15, params.description, {
            fontFamily: "Early_GameBoy",
            fontSize: "12px",
            color: "#2c2c2c",
            stroke: "#ffffff",
            strokeThickness: 2,
        });
        card.add(desc);

        const cost = this.add.text(-cardWidth / 2 + 20, 10, params.costLabel, {
            fontFamily: "Early_GameBoy",
            fontSize: "16px",
            color: "#0f6b2f",
            stroke: "#ffffff",
            strokeThickness: 2,
        });
        card.add(cost);

        const reward = this.add.text(-cardWidth / 2 + 20, 35, params.rewardLabel, {
            fontFamily: "Early_GameBoy",
            fontSize: "14px",
            color: "#000000",
            stroke: "#ffffff",
            strokeThickness: 2,
        });
        card.add(reward);

        const button = this.add.rectangle(cardWidth / 2 - 55, 10, 100, 34, 0x228b22, 0.85);
        button.setStrokeStyle(3, 0x000000);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(cardWidth / 2 - 55, 10, "PRODUCI", {
            fontFamily: "Early_GameBoy",
            fontSize: "14px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3,
        }).setOrigin(0.5);

        button.on("pointerover", () => {
            button.setScale(1.08);
            buttonText.setScale(1.08);
        });
        button.on("pointerout", () => {
            button.setScale(1);
            buttonText.setScale(1);
        });
        button.on("pointerdown", params.onProduce);

        card.add(button);
        card.add(buttonText);

        this.panel.add(card);


        const smallicon = 50;
        const iconGap = 4;
        if(params.iconKey && this.textures.exists(params.iconKey)){
            const startX = title.x + (title.width ?? 0) + 8;
                const icon  = this.add.image(startX ,title.y+15, params.iconKey);
                icon.setOrigin(0,.5);
                icon.setDisplaySize(smallicon, smallicon);
                card.add(icon);

        }
    }

    private produceCheese(): void {
        // 2 milk -> 1 cheese.
        if (this.playerInventory.latte < 2) {
            this.showMessage("LATTE INSUFFICIENTE!", 0xff0000);
            return;
        }
        this.playerInventory.latte -= 2;
        this.playerInventory.formaggio += 1;
        this.registry.set("playerInventory", { ...this.playerInventory });
        this.refreshInventoryText();
        this.showMessage("FORMAGGIO PRODOTTO!", 0x00aa00);
    }

    private produceBlanket(): void {
        // 1 wool -> 1 blanket.
        if (this.playerInventory.lana < 1) {
            this.showMessage("LANA INSUFFICIENTE!", 0xff0000);
            return;
        }
        this.playerInventory.lana -= 1;
        this.playerInventory.coperte += 1;
        this.registry.set("playerInventory", { ...this.playerInventory });
        this.refreshInventoryText();
        this.showMessage("COPERTA PRODOTTA!", 0x00aa00);
    }

    private persistInventory(): void {
        // Update only the properties instead of replacing the object.
        this.registry.set("playerInventory", { ...this.playerInventory });
        this.events.emit("inventoryUpdated", this.playerInventory);
        this.refreshInventoryText();
    }

    private refreshInventoryText(): void {
        // Always show 0 when the value is undefined or NaN.
        const latte = Number.isFinite(this.playerInventory.latte) ? this.playerInventory.latte : 0;
        const lana = Number.isFinite(this.playerInventory.lana) ? this.playerInventory.lana : 0;
        const formaggio = Number.isFinite(this.playerInventory.formaggio) ? this.playerInventory.formaggio : 0;
        const coperte = Number.isFinite(this.playerInventory.coperte) ? this.playerInventory.coperte : 0;
        this.inventoryText.setText(
            `LATTE: ${latte}   LANA: ${lana}   FORMAGGIO: ${formaggio}   COPERTE: ${coperte}`
        );
    }

    private showMessage(text: string, color: number): void {
        const { width, height } = this.cameras.main;

        this.messageBg?.destroy();
        this.messageText?.destroy();

        this.messageBg = this.add.rectangle(width / 2, height * 0.12, text.length * 14, 60, color)
            .setStrokeStyle(4, 0x000000)
            .setDepth(1001);

        this.messageText = this.add.text(width / 2, height * 0.12, text, {
            fontFamily: "Early_GameBoy",
            fontSize: "24px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(1002);

        this.tweens.add({
            targets: [this.messageBg, this.messageText],
            alpha: 0,
            y: `-=30`,
            duration: 1400,
            ease: "Power2",
            onComplete: () => {
                this.messageBg?.destroy();
                this.messageText?.destroy();
                this.messageBg = undefined;
                this.messageText = undefined;
            },
        });
    }

    private loadInventoryFromRegistry(): void {
        // No longer needed because the inventory is shared by GamePlay.
    }

    private createGlassEffect(panelWidth: number, panelHeight: number): void {
        const g = this.add.graphics();

        g.fillStyle(0xffffff, 0.12);
        for (let i = 0; i < 400; i++) {
            const x = (Math.random() - 0.5) * panelWidth;
            const y = (Math.random() - 0.5) * panelHeight;
            const size = Math.random() * 3 + 1;
            g.fillCircle(x, y, size);
        }

        g.lineStyle(1, 0xffffff, 0.08);
        for (let i = 0; i < 30; i++) {
            const x1 = (Math.random() - 0.5) * panelWidth;
            const y1 = (Math.random() - 0.5) * panelHeight;
            const x2 = x1 + (Math.random() - 0.5) * 50;
            const y2 = y1 + (Math.random() - 0.5) * 50;
            g.lineBetween(x1, y1, x2, y2);
        }

        this.panel.add(g);
    }

    private close(): void {
        if (this.scene.isPaused("GamePlay")) {
            this.scene.resume("GamePlay");
        }
        this.scene.stop("Laboratory");
    }
}