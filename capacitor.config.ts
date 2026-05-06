import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.muhlle.musensmad",
  appName: "Musens Mad",
  webDir: "dist",
  ios: {
    contentInset: "automatic"
  }
};

export default config;
