import { ERAS } from "../data/EraData";

export default class Store extends Phaser.Scene {
    // UI references.
    private background!: Phaser.GameObjects.Image;
    private storePanel!: Phaser.GameObjects.Container;
    private closeButton!: Phaser.GameObjects.Text;
    private currentEraIndex = 0;

    // Player inventory synchronized with the registry.
    private playerInventory = {
        formaggio: 0,
        coperte: 0,
        lana: 0,
        latte: 0,
        lvlCesoie: 0, // 0 = none, 1 = basic, 2 = advanced.
        lvlSecchi: 0, // 0 = none, 1 = basic, 2 = advanced.
        pecore: 0,
        pecoreNere: 0
    };

    // Store product definitions.
    private products = [
        {
            id: 'cesoie',
            name: 'CESOIE',
            priceFormaggio: 0,
            priceCoperte: 0,
            description: 'Per tosare le pecore',
            icon: 'icon_cesoie_N1',
            image : "icon_cesoie_N1"
        },
        {
            id: 'secchi',
            name: 'SECCHI',
            priceFormaggio: 0,
            priceCoperte: 2,
            description: 'Per mungere le pecore',
            icon: 'U',
            image: "secchio_N1"
        },
        {
            id: 'cesoieAvanzate',
            name: 'CESOIE AVANZATE',
            priceFormaggio: 1,
            priceCoperte: 1,
            description: 'Cesoie piu veloci',
            icon: 'X+',
            image: 'icon_cesoie_N2',
            requirement: 'cesoie'
        },
        {
            id: 'secchiAvanzati',
            name: 'SECCHIO AVANZATO',
            priceFormaggio: 1,
            priceCoperte: 2,
            description: 'Secchi piu capienti',
            icon: 'U+',
            image :'secchio_N2',
            requirement: 'secchi'
        },
        {
            id: 'pecora',
            name: 'PECORA',
            priceFormaggio: 3,
            priceCoperte: 2,
            description: 'Nuova pecora da fattoria',
            icon: 'P',
            image :'pecora',
           
        },
        {
            id: 'pecoraNera',
            name: 'PECORA NERA',
            priceFormaggio: 10,
            priceCoperte: 8,
            description: 'Pecora speciale e rara',
            icon: 'PN',
            minPecore: 5,
            image :'nera'
        }
    ];

    constructor() {
        super({ key: "Store" });
    }

    init() {
        console.log("Store.init() - Inizializzazione Store");
        const savedEraIndex = this.registry.get('eraIndex');
        if (typeof savedEraIndex === 'number' && Number.isInteger(savedEraIndex)) {
            this.currentEraIndex = Phaser.Math.Clamp(savedEraIndex, 0, ERAS.length - 1);
        }
        this.addEraProduct();
        this.loadInventoryFromRegistry();
    }

    private addEraProduct(): void {
        this.products = this.products.filter(
            (product) => product.id !== 'nextEra' && product.id !== 'pecoraNera',
        );

        if (this.currentEraIndex < ERAS.length - 1) {
            this.products.push({
                id: 'nextEra',
                name: 'PROSSIMA ERA',
                priceFormaggio: 10,
                priceCoperte: 8,
                description: `Sblocca: ${ERAS[this.currentEraIndex + 1].name}`,
                icon: 'ERA',
                image: 'old-nuraghe',
            });
        } else {
            this.products.push({
                id: 'pecoraNera',
                name: 'PECORA NERA',
                priceFormaggio: 10,
                priceCoperte: 8,
                description: 'Pecora speciale e rara',
                icon: 'PN',
                minPecore: 5,
                image: 'nera',
            });
        }
    }

    preload() {
        // The store background is loaded centrally through GameData.
    }

    create() {
        console.log("Store.create() - Costruzione interfaccia Store");

        const { width, height } = this.cameras.main;

        // Background showing the Sardinian town.
        this.background = this.add.image(0, 0, 'store_bg');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(width, height);

        // Light overlay for additional contrast.
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.2);
        overlay.setOrigin(0, 0);
        overlay.setInteractive();

        // Main store container.
        this.storePanel = this.add.container(width / 2, height / 2);

        // ===== WHITE/GRAY FROSTED GLASS EFFECT =====
        // Highly transparent light-gray panel background.
        const panelBg = this.add.rectangle(0, 0, width * 0.85, height * 0.8, 0xe8e8e8, 0.35);
        panelBg.setStrokeStyle(6, 0x8b8b8b, 0.6);
        this.storePanel.add(panelBg);

        // Semi-transparent decorative white inner border.
        const innerBorder = this.add.rectangle(0, 0, width * 0.82, height * 0.77, 0xffffff, 0.2);
        innerBorder.setStrokeStyle(3, 0xcccccc, 0.5);
        this.storePanel.add(innerBorder);

        // Stronger frosted-glass effect.
        this.createGlassEffect(width * 0.82, height * 0.77);

        // Store title in the menu's pixel style.
        const title = this.add.text(0, -height * 0.35, 'NEGOZIO SA PECORA NIEDDA', {
            fontSize: '36px',
            fontFamily: 'Early_GameBoy',
            color: '#4fa4c1',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        this.storePanel.add(title);

        // Sardinian subtitle.
        const subtitle = this.add.text(0, -height * 0.30, 'Baratta formaggio e coperte', {
            fontSize: '18px',
            fontFamily: 'Early_GameBoy',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);
        this.storePanel.add(subtitle);

        // Player inventory display.
        this.createInventoryDisplay();

        // Create the product grid.
        this.createProductGrid();

        // Close button in the menu's retro style.
        this.closeButton = this.add.text(width * 0.38, -height * 0.35, 'X', {
            fontSize: '32px',
            fontFamily: 'Early_GameBoy',
            color: '#4fa4c1',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        this.closeButton.setOrigin(0.5);
        this.closeButton.setInteractive({ useHandCursor: true });
        this.closeButton.on('pointerdown', () => this.closeStore());
        this.closeButton.on('pointerover', () => {
            this.closeButton.setScale(1.2);
        });
        this.closeButton.on('pointerout', () => {
            this.closeButton.setScale(1);
        });
        this.storePanel.add(this.closeButton);

        // Bottom instructions in the retro style.
        const instructions = this.add.text(0, height * 0.34,
            'ESC per uscire', {
                fontSize: '16px',
                fontFamily: 'Early_GameBoy',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            });
        instructions.setOrigin(0.5);
        this.storePanel.add(instructions);

        // Press ESC to close and return to GamePlay.
        this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escKeyListener = () => this.closeStore();
        this.escKey.on('down', this.escKeyListener);
            this.scene.resume('GamePlay');
    }

    /**
     * Creates a strong frosted-glass effect with a white noise pattern.
     */
    private createGlassEffect(panelWidth: number, panelHeight: number): void {
        const graphics = this.add.graphics();

        // Create a dense pattern of white dots for the frosted-glass effect.
        graphics.fillStyle(0xffffff, 0.12);

        // Add more dots for a stronger blur effect.
        for (let i = 0; i < 400; i++) {
            const x = (Math.random() - 0.5) * panelWidth;
            const y = (Math.random() - 0.5) * panelHeight;
            const size = Math.random() * 3 + 1;
            graphics.fillCircle(x, y, size);
        }

        // Add thin lines for a textured effect.
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

        // Semi-transparent light-gray inventory background.
        const inventoryBg = this.add.rectangle(0, -height * 0.24, width * 0.75, 60, 0xd4d4d4, 0.45);
        inventoryBg.setStrokeStyle(3, 0x8b8b8b, 0.6);
        this.storePanel.add(inventoryBg);

        const inventoryText = this.add.text(0, -height * 0.24,
            `FORMAGGIO: ${this.playerInventory.formaggio}   COPERTE: ${this.playerInventory.coperte}   PECORE: ${this.playerInventory.pecore}`,
            {
                fontSize: '20px',
                fontFamily: 'Early_GameBoy',
                color: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        inventoryText.setOrigin(0.5);
        inventoryText.setName('inventoryDisplay');
        this.storePanel.add(inventoryText);
    }

    private createProductGrid(): void {
        const { width, height } = this.cameras.main;
        const startY = -height * 0.12;
        const spacing = 115;

        this.products.forEach((product, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const x = (col === 0 ? -width * 0.22 : width * 0.22);
            const y = startY + (row * spacing);

            this.createProductCard(product, x, y);
        });
    }

    private createProductCard(product: any, x: number, y: number): void {
        const cardWidth = this.cameras.main.width * 0.38;
        const cardHeight = 100;

        // Card container.
        const card = this.add.container(x, y);

        // Highly transparent light-gray/beige card background.
        const cardBg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0xc8b89a, 0.5);
        cardBg.setStrokeStyle(3, 0x6b6b6b, 0.7);
        card.add(cardBg);

        // Semi-transparent white inner border.
        const cardBorder = this.add.rectangle(0, 0, cardWidth - 6, cardHeight - 6, 0xffffff, 0.2);
        cardBorder.setStrokeStyle(2, 0xaaaaaa, 0.5);
        card.add(cardBorder);

        // Enlarged product icon.
        const icon = this.add.image(-210,0,product.image);
        icon.setDisplaySize(70, 70);
        icon.setOrigin(0.5,0.5);
        //icon.setScale(0.1)
        card.add(icon);

        // Product name in the retro style.
        const nameText = this.add.text(-cardWidth / 2 + 70, -25, product.name, {
            fontSize: '18px',
            fontFamily: 'Early_GameBoy',
            color: '#4fa4c1',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        card.add(nameText);

        // Description.
        const descText = this.add.text(-cardWidth / 2 + 70, 0, product.description, {
            fontSize: '12px',
            fontFamily: 'Early_GameBoy',
            color: '#2c2c2c',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        card.add(descText);

        // Price.
        let priceStr = '';
        if (product.priceFormaggio === 0 && product.priceCoperte === 0) {
            priceStr = 'GRATIS';
        } else {
            const parts = [];
            if (product.priceFormaggio > 0) parts.push(`${product.priceFormaggio}F`);
            if (product.priceCoperte > 0) parts.push(`${product.priceCoperte}C`);
            priceStr = parts.join('+');
        }

        const priceText = this.add.text(-cardWidth / 2 + 70, 18, priceStr, {
            fontSize: '16px',
            fontFamily: 'Early_GameBoy',
            color: '#228b22',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        });
        card.add(priceText);

        // Purchase button in the menu's retro style.
        const buyButton = this.add.rectangle(cardWidth / 2 - 45, 0, 80, 30, 0x228b22, 0.85);
        buyButton.setStrokeStyle(3, 0x000000);
        buyButton.setInteractive({ useHandCursor: true });

        const buyText = this.add.text(cardWidth / 2 - 45, 0, 'COMPRA', {
            fontSize: '14px',
            fontFamily: 'Early_GameBoy',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        buyText.setOrigin(0.5);

        // Button events with the menu's hover scale effect.
        buyButton.on('pointerover', () => {
            buyButton.setScale(1.1);
            buyText.setScale(1.1);
        });

        buyButton.on('pointerout', () => {
            buyButton.setScale(1);
            buyText.setScale(1);
        });

        buyButton.on('pointerdown', () => {
            this.purchaseProduct(product);
        });

        card.add(buyButton);
        card.add(buyText);

        this.storePanel.add(card);
    }

    private purchaseProduct(product: any): void {
        // Check special requirements.
        if (product.requirement) {
            if (product.requirement === 'cesoie' && this.playerInventory.lvlCesoie < 1) {
                this.showMessage('SERVE CESOIE BASE!', 0xff0000);
                return;
            }
            if (product.requirement === 'secchi' && this.playerInventory.lvlSecchi < 1) {
                this.showMessage('SERVE SECCHI BASE!', 0xff0000);
                return;
            }
        }

        // Check the minimum sheep count for a black sheep.
        if (product.minPecore && this.playerInventory.pecore < product.minPecore) {
            this.showMessage(`SERVONO ${product.minPecore} PECORE!`, 0xff0000);
            return;
        }

        // Check whether enough resources are available.
        if (this.playerInventory.formaggio < product.priceFormaggio) {
            this.showMessage('FORMAGGIO INSUFFICIENTE!', 0xff0000);
            return;
        }

        if (this.playerInventory.coperte < product.priceCoperte) {
            this.showMessage('COPERTE INSUFFICIENTI!', 0xff0000);
            return;
        }

        // Complete the purchase.
        this.playerInventory.formaggio -= product.priceFormaggio;
        this.playerInventory.coperte -= product.priceCoperte;

        // Add the item to the inventory.
        switch (product.id) {
            case 'cesoie':
                this.playerInventory.lvlCesoie = 1;
                break;
            case 'cesoieAvanzate':
                this.playerInventory.lvlCesoie = 2;
                break;
            case 'secchi':
                this.playerInventory.lvlSecchi = 1;
                break;
            case 'secchiAvanzati':
                this.playerInventory.lvlSecchi = 2;
                break;
            case 'pecora':
                this.playerInventory.pecore += 1;
                break;
            case 'pecoraNera':
                this.playerInventory.pecoreNere += 1;
                this.playerInventory.pecore += 1;
                this.registry.set('victory', true);
                break;
            case 'nextEra':
                this.currentEraIndex += 1;
                this.registry.set('eraIndex', this.currentEraIndex);
                break;
        }

        // Save to the registry.
        this.saveInventoryToRegistry();

        // Update the display.
        this.updateInventoryDisplay();

        // Success message.
        this.showMessage(`${product.name} ACQUISTATO!`, 0x00ff00);

        if (product.id === 'pecoraNera') {
            this.scene.stop('GamePlay');
            this.scene.stop('Hud');
            this.scene.start('Victory');
        }

        // Purchase sound, when available.
        if (this.sound.get('purchase')) {
            this.sound.play('purchase', { volume: 0.5 });
        }
    }

    private updateInventoryDisplay(): void {
        const inventoryDisplay = this.storePanel.getByName('inventoryDisplay') as Phaser.GameObjects.Text;
        if (inventoryDisplay) {
            inventoryDisplay.setText(
                `FORMAGGIO: ${this.playerInventory.formaggio}   COPERTE: ${this.playerInventory.coperte}   PECORE: ${this.playerInventory.pecore}`
            );
        }
    }

    private showMessage(text: string, color: number): void {
        const { width, height } = this.cameras.main;

        // Message background.
        const messageBg = this.add.rectangle(width / 2, height * 0.12, text.length * 14, 60, color);
        messageBg.setStrokeStyle(4, 0x000000);
        messageBg.setDepth(1001);

        const message = this.add.text(width / 2, height * 0.12, text, {
            fontSize: '24px',
            fontFamily: 'Early_GameBoy',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        });
        message.setOrigin(0.5);
        message.setDepth(1002);

        // Fade-out animation.
        this.tweens.add({
            targets: [messageBg, message],
            alpha: 0,
            y: `-=30`,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                messageBg.destroy();
                message.destroy();
            }
        });
    }

    private loadInventoryFromRegistry(): void {
        // Load the inventory from the Phaser registry.
        const saved = this.registry.get('playerInventory');
        if (saved) {
            this.playerInventory = { ...this.playerInventory, ...saved };

            // Support older saves that used cesoie/secchi fields.
            if (typeof saved.cesoie === 'number' && typeof saved.lvlCesoie !== 'number') {
                this.playerInventory.lvlCesoie = saved.cesoie;
            }
            if (typeof saved.secchi === 'number' && typeof saved.lvlSecchi !== 'number') {
                this.playerInventory.lvlSecchi = saved.secchi;
            }
        }
    }

    private saveInventoryToRegistry(): void {
        // Save the inventory to the registry.
        this.registry.set('playerInventory', this.playerInventory);

        // Emit an event to notify other scenes.
        this.events.emit('inventoryUpdated', this.playerInventory);
    }

    private closeStore(): void {
        console.log("Store.closeStore() - Chiusura store");

        // Remove the listener and destroy the ESC key.
        if (this.escKey && this.escKeyListener) {
            this.escKey.off('down', this.escKeyListener);
            this.input.keyboard!.removeKey(this.escKey);
            this.escKey = undefined;
            this.escKeyListener = undefined;
        }

        // Resume GamePlay if it was paused.
        if (this.scene.isPaused('GamePlay')) {
            this.scene.resume('GamePlay');
        }

        // Close the store.
        this.scene.stop('Store');
    }
    // Properties used to manage the ESC key.
    private escKey?: Phaser.Input.Keyboard.Key;
    private escKeyListener?: () => void;
}
