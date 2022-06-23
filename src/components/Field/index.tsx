import React, { Fragment, useEffect } from "react";
import { Button, Box } from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import "codemirror/lib/codemirror.css";
import { useSDK } from "@contentful/react-apps-toolkit";

interface FieldProps {
  selectedItem: Record<string, any> | null;
}

const Field = (props: FieldProps) => {
  const sdk = useSDK<FieldExtensionSDK>();
  const { selectedItem } = props;

  useEffect(() => {
    sdk.window.startAutoResizer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Data does not get logged after it is set in App.tsx
    console.log(
      "🚀 ~ file: index.tsx ~ line 23 ~ useEffect ~ selectedItem",
      selectedItem
    );
  }, [selectedItem]);

  return (
    <Fragment>
      <Box marginBottom="spacingM">
        <Button
          onClick={() =>
            sdk.dialogs.openCurrentApp({
              title: "Dialog",
              shouldCloseOnEscapePress: true,
              shouldCloseOnOverlayClick: true,
              minHeight: "600px",
              width: 1200,
            })
          }
        >
          Open dialog
        </Button>
      </Box>
    </Fragment>
  );
};

export default Field;
