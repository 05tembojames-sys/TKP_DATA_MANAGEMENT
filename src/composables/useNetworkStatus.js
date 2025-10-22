import { ref, onMounted, onUnmounted } from "vue";
import enhancedOutreachService from "../services/enhancedOutreachService.js";
import { setFirestoreNetworkStatus } from "../firebase/config.js";

export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine);
  const isChecking = ref(false);

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine;
  };

  const checkConnection = async () => {
    isChecking.value = true;

    try {
      // Try to fetch a small resource to test connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("/", {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      isOnline.value = response.ok;
    } catch (error) {
      isOnline.value = false;
    } finally {
      isChecking.value = false;
    }

    // Update Firebase network status
    try {
      await setFirestoreNetworkStatus(isOnline.value);
    } catch (error) {
      console.error("Error updating Firebase network status:", error);
    }

    return isOnline.value;
  };

  let onlineListener, offlineListener;

  onMounted(() => {
    // Set up event listeners for online/offline events
    onlineListener = async () => {
      isOnline.value = true;
      // Update Firebase network status
      try {
        await setFirestoreNetworkStatus(true);
      } catch (error) {
        console.error("Error enabling Firebase network:", error);
      }

      // When coming back online, auto-sync pending forms
      try {
        const result = await enhancedOutreachService.autoSyncWhenOnline();
        if (result.success && result.syncedCount > 0) {
          console.log(`Auto-synced ${result.syncedCount} forms`);
        }
      } catch (error) {
        console.error("Error during auto-sync:", error);
      }
    };

    offlineListener = async () => {
      isOnline.value = false;
      // Update Firebase network status
      try {
        await setFirestoreNetworkStatus(false);
      } catch (error) {
        console.error("Error disabling Firebase network:", error);
      }
    };

    window.addEventListener("online", onlineListener);
    window.addEventListener("offline", offlineListener);
  });

  onUnmounted(() => {
    // Clean up event listeners
    if (onlineListener) {
      window.removeEventListener("online", onlineListener);
    }

    if (offlineListener) {
      window.removeEventListener("offline", offlineListener);
    }
  });

  return {
    isOnline,
    isChecking,
    checkConnection,
  };
}
