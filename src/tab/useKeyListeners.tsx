import { useEffect, useRef, useState } from "react";
import { useNt4 } from "@frc-web-components/react";

function useKeyListeners(
  propKeys: Record<string, string>,
  callback: (prop: string, key: string, value: unknown) => unknown,
  immediateNotify: boolean
) {
  const { store } = useNt4();
  // maps keys to unsubscribers
  const [unsubscribers, setUnsubscribers] = useState<Record<string, () => void>>({});
  const unsubscribeAllRef = useRef<(() => void)[]>([]);

  useEffect(() => {

    const newKeys = Object.values(propKeys);
    const oldKeys = Object.keys(unsubscribers);

    // unsubscribe 
    Object.entries(unsubscribers).forEach(([key, unsubscriber]) => {
      if (!newKeys.includes(key)) {
        unsubscriber();
      }
    });
    
    // create new unsubscriber maps
    const newUnsubscribers: Record<string, () => void> = {};

    // loop through each item in the propKey map keep old subscribers
    // that already exist and adding new ones to map
    Object.entries(propKeys).forEach(([prop, key]) => {
      if (oldKeys.includes(key)) {
        newUnsubscribers[key] = unsubscribers[key];
        return;
      }
      const newUnsubscriber = store.subscribe(
        "NetworkTables",
        key,
        (value: unknown) => {
          callback(prop, key, value);
        },
        immediateNotify
      );
      newUnsubscribers[key] = newUnsubscriber;
    });

    unsubscribeAllRef.current = Object.values(newUnsubscribers);

    setUnsubscribers(newUnsubscribers);
  }, [propKeys, callback]);

  useEffect(() => {
    return () => {
      unsubscribeAllRef.current.forEach(unsubscriber => {
        unsubscriber();
      });
    };
  }, []);
}

export default useKeyListeners;
