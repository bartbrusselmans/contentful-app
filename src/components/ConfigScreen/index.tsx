import React, { useCallback, useState, useEffect, ChangeEvent } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  Heading,
  Form,
  TextInput,
  Flex,
  FormControl,
} from "@contentful/f36-components";
import { css } from "emotion";
import { InstallationParameters } from "../../@types";
import { useSDK } from "@contentful/react-apps-toolkit";

const INITIAL_INSTALLATION_PARAMS = {
  authEndpoint: "",
  clientId: "",
  clientSecret: "",
};

const ConfigScreen = () => {
  const sdk = useSDK<AppExtensionSDK>();

  const [parameters, setParameters] = useState<InstallationParameters>(
    INITIAL_INSTALLATION_PARAMS
  );

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: InstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      setParameters({
        ...parameters,
        [e.target.name]: e.target.value,
      });
    },
    [parameters, setParameters]
  );

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <Form>
        <Heading>App Config</Heading>
        <FormControl isRequired isInvalid={!parameters.authEndpoint}>
          <FormControl.Label>Authorization Endpoint</FormControl.Label>
          <TextInput
            value={parameters.authEndpoint}
            type="text"
            name="authEndpoint"
            id="authEndpoint"
            onChange={handleChange}
          />
          {!parameters.authEndpoint && (
            <FormControl.ValidationMessage>
              Please, provide the authorization endpoint.
            </FormControl.ValidationMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!parameters.clientId}>
          <FormControl.Label>Authorization client id</FormControl.Label>
          <TextInput
            value={parameters.clientId}
            type="text"
            name="clientId"
            id="clientId"
            onChange={handleChange}
          />
          {!parameters.clientId && (
            <FormControl.ValidationMessage>
              Please, provide the client id.
            </FormControl.ValidationMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={!parameters.clientSecret}>
          <FormControl.Label>Authorization client secret</FormControl.Label>
          <TextInput
            value={parameters.clientSecret}
            type="text"
            name="clientSecret"
            id="clientSecret"
            onChange={handleChange}
          />
          {!parameters.clientSecret && (
            <FormControl.ValidationMessage>
              Please, provide the client secret.
            </FormControl.ValidationMessage>
          )}
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
