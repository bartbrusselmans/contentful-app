import React, { useCallback, useEffect, useMemo, useState } from "react";

import { locations } from "@contentful/app-sdk";
import ConfigScreen from "./components/ConfigScreen";
import Field from "./components/Field";
import Dialog from "./components/Dialog";
import { useSDK } from "@contentful/react-apps-toolkit";

const App = () => {
  const sdk = useSDK();
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(
    null
  );

  const setFieldValue = useCallback((value: Record<string, any> | null) => {
    setSelectedItem(value);
  }, []);

  useEffect(() => {
    // Data gets logged here so state is set
    console.log(
      "🚀 ~ file: App.tsx ~ line 28 ~ App ~ selectedItem",
      selectedItem
    );
  }, [selectedItem]);

  useEffect(() => {
    //  sdk.location.is(locations.LOCATION_ENTRY_FIELD) becomes false when opening the dialog but does not return to true when closing the dialog
    console.log(
      "🚀 ~ file: App.tsx ~ line 28 ~ App ~ sdk.location is FIELD",
      sdk.location.is(locations.LOCATION_ENTRY_FIELD)
    );
  }, [sdk]);

  const Component = useMemo(() => {
    const ComponentLocationSettings = [
      {
        location: locations.LOCATION_ENTRY_FIELD,
        component: <Field selectedItem={selectedItem} />,
      },
      {
        location: locations.LOCATION_DIALOG,
        component: <Dialog setFieldValue={setFieldValue} />,
      },
      {
        location: locations.LOCATION_APP_CONFIG,
        component: <ConfigScreen />,
      },
    ];

    for (const componentLocationSetting of ComponentLocationSettings) {
      if (sdk.location.is(componentLocationSetting.location)) {
        return componentLocationSetting.component;
      }
    }
    return null;
  }, [sdk.location, selectedItem, setFieldValue]);


  return Component ? Component : null;
};

export default App;
