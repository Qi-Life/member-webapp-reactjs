export function fcmSwEnvPlugin() {
  return {
    name: "rollup-plugin-fcm-sw-env",
    transform(code: string, id: string) {
      if (id.endsWith("/firebase-messaging-sw.js")) {
        // Replace process.env variables with their actual values
        return code.replace(
          new RegExp(`process.env.(\\w+)`, "g"),
          (_, varName) => `"${process.env[varName]}"`
        );
      }
      return null;
    },
  };
}
