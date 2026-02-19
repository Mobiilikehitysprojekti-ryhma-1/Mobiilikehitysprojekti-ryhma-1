import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, Platform, Alert, ScrollView } from "react-native";
import * as Notifications from "expo-notifications";
import type { MealsItems } from "../../admin/data/mealsRepository";
import type { MedsItems } from "../../admin/data/medsRepository";

// Näytä notifit kun ne tulee (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === "granted") return true;

  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

function safeStringify(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

/** Parse "HH:mm" to { hour, minute } for daily trigger. */
function parseTime(timeStr: string): { hour: number; minute: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hour: h ?? 0, minute: m ?? 0 };
}

type Props = {
  mealsSchedule?: MealsItems | null;
  medsSchedule?: MedsItems | null;
};

export default function NotificationsDemo({ mealsSchedule, medsSchedule }: Props) {
  const [scheduled, setScheduled] = useState<Notifications.NotificationRequest[]>([]);
  const scheduleIdsRef = useRef<string[]>([]);

  useEffect(() => {
    // Android: ilmoituskanava (ei pakollinen, mutta hyvä käytäntö)
    async function setupAndroidChannel() {
      if (Platform.OS !== "android") return;
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    setupAndroidChannel();
  }, []);

  // Show Alert when a notification is received (foreground) or when user taps it
  useEffect(() => {
    const showAlert = (title: string, body: string) => {
        Alert.alert(title, body, [
          {
            text: "Ei otettu",
            style: "cancel",
            onPress: () => {
              console.log("Käyttäjä ei ottanut");
              // tee jotain: esim. peru hälytys / merkitse väliin
            },
          },
          {
            text: "Otettu",
            onPress: () => {
              console.log("Käyttäjä otti");
              // tee jotain: esim. kuittaa lääke / tallenna DB
            },
          },
        ]);
      };

      
    const received = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      showAlert(title ?? "Ilmoitus", body ?? "");
    });

    const responded = Notifications.addNotificationResponseReceivedListener((response) => {
      const { title, body } = response.notification.request.content;
      showAlert(title ?? "Ilmoitus", body ?? "");
    });

    return () => {
      received.remove();
      responded.remove();
    };
  }, []);

  // Schedule daily notifications for meal and med times from Firebase
  useEffect(() => {
    const meals = mealsSchedule ?? null;
    const meds = medsSchedule ?? null;
    if (!meals && !meds) return;

    let cancelled = false;
    (async () => {
      const ok = await ensurePermission();
      if (!ok || cancelled) return;

      // Always clear all scheduled notifications first (ref is lost on remount e.g. after admin)
      await Notifications.cancelAllScheduledNotificationsAsync();
      scheduleIdsRef.current = [];

      const newIds: string[] = [];

      if (meals) {
        const mealEntries = [
          ["breakfast", meals.breakfast],
          ["lunch", meals.lunch],
          ["dinner", meals.dinner],
          ["supper", meals.supper],
        ] as const;
        for (const [key, item] of mealEntries) {
          const { hour, minute } = parseTime(item.time);
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Ruoka",
              body: `${item.label} – ${item.time}`,
              sound: true,
              data: { type: "meal", key },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour,
              minute,
            },
          });
          newIds.push(id);
        }
      }

      if (meds) {
        const medEntries = [
          ["morning", meds.morning],
          ["noon", meds.noon],
          ["evening", meds.evening],
          ["night", meds.night],
        ] as const;
        for (const [key, item] of medEntries) {
          const { hour, minute } = parseTime(item.time);
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Lääkkeet",
              body: `${item.label} – ${item.time}`,
              sound: true,
              data: { type: "med", key },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour,
              minute,
            },
          });
          newIds.push(id);
        }
      }

      if (!cancelled) scheduleIdsRef.current = newIds;
    })();
    return () => {
      cancelled = true;
    };
  }, [mealsSchedule, medsSchedule]);

  async function createAlarmIn60Seconds() {
    const ok = await ensurePermission();
    if (!ok) {
      Alert.alert("Ei lupaa", "Notifikaatiolupaa ei myönnetty.");
      return;
    }

    const date = new Date(Date.now() + 60 * 1000);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hälytys",
        body: `Hälytys ajalle ${date.toLocaleString()}`,
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date }, // kertaluonteinen
    });

    Alert.alert("Ajastettu", `Luotiin hälytys.\nID: ${id}\nAika: ${date.toLocaleString()}`);
  }

  async function readAllAlarms() {
    const ok = await ensurePermission();
    if (!ok) {
      Alert.alert("Ei lupaa", "Notifikaatiolupaa ei myönnetty.");
      return;
    }

    const all = await Notifications.getAllScheduledNotificationsAsync();
    setScheduled(all);
    Alert.alert("Luettu", `Ajastettuja hälytyksiä: ${all.length}`);
  }

  async function deleteAllAlarms() {
    // ei yleensä vaadi lupaa, mutta pidetään sama linja
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync(); // poistaa myös näkyvät
    setScheduled([]);
    
    Alert.alert("Poistettu", "Kaikki ajastetut hälytykset poistettu."); 
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      
{/* 
      <Button title="Luo hälytys 60 sek päästä" onPress={createAlarmIn60Seconds} />
      <Button title="Lue kaikki hälytykset" onPress={readAllAlarms} />
    

      <Text style={{ marginTop: 12, fontWeight: "600" }}>
        Ajastetut hälytykset ({scheduled.length})
      </Text> 

      <ScrollView style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 }}>
        <Text selectable style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
          {scheduled.length ? safeStringify(scheduled) : "Ei ajastettuja hälytyksiä."}
        </Text>
      </ScrollView>
      */}
        <Button title="Poista kaikki hälytykset laitteesta" onPress={deleteAllAlarms} />
    </View>
  );
}
