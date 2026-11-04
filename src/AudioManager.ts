interface AudioItem {
  name: string;
  volume: number;
}

interface AudioSettings {
  music?: AudioItem[];
  sfx?: AudioItem[];
  voices?: AudioItem[];
}

export class AudioManager {
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly settings: AudioSettings,
  ) {}

  public setCategoryVolume(
    category: keyof AudioSettings,
    volume: number,
  ): void {
    const safeVolume = Phaser.Math.Clamp(volume, 0, 1);
    const items = this.settings[category] ?? [];

    for (const item of items) {
      item.volume = safeVolume;
      const sound = this.scene.sound.get(item.name);
      this.applyVolume(sound, safeVolume);
    }
  }

  public setAudioVolume(audioName: string, volume: number): void {
    const safeVolume = Phaser.Math.Clamp(volume, 0, 1);
    const item = this.findAudioItem(audioName);

    if (!item) {
      return;
    }

    item.volume = safeVolume;
    const sound = this.scene.sound.get(audioName);
    this.applyVolume(sound, safeVolume);
  }

  public getSettings(): AudioSettings {
    return this.settings;
  }

  private findAudioItem(audioName: string): AudioItem | undefined {
    const categories: Array<keyof AudioSettings> = ["music", "sfx", "voices"];

    for (const category of categories) {
      const item = this.settings[category]?.find(
        (audio) => audio.name === audioName,
      );
      if (item) {
        return item;
      }
    }

    return undefined;
  }

  private applyVolume(
    sound: Phaser.Sound.BaseSound | undefined,
    volume: number,
  ): void {
    if (
      sound &&
      "setVolume" in sound &&
      typeof sound.setVolume === "function"
    ) {
      sound.setVolume(volume);
    }
  }
}
