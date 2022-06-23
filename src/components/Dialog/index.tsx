import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Card,
  Flex,
  FormControl,
  Paragraph,
  Spinner,
  Stack,
  TextInput,
} from "@contentful/f36-components";
import { DialogExtensionSDK } from "@contentful/app-sdk";
import useAuthorization from "../../hooks/useAuthorization";
import useFetch from "../../hooks/useFetch";
import { useSDK } from "@contentful/react-apps-toolkit";

interface DialogProps {
  setFieldValue: (value: Record<string, any> | null) => void;
}

interface IData {
  Total: number;
  Results: Record<string, any>[];
}

const Dialog = (props: DialogProps) => {
  const sdk = useSDK<DialogExtensionSDK>();
  const { setFieldValue } = props;

  const {
    data: auth,
    loading: authLoading,
    error: authError,
  } = useAuthorization(sdk);
  const accesToken = auth?.access_token;

  const params = new URLSearchParams();
  params.append("Select", "header_record.ObjectKey");
  params.append(
    "Filter",
    "material_description.MaterialDescription like 'SINT%'"
  );
  params.append(
    "Segments",
    "material_description, material_ean,material_marketing_commercial_name"
  );
  params.append("AllowsMultipleResults", "true");

  const config = {
    method: "get",
    url: "https://arvesta-qas.apimanagement.hana.ondemand.com/cdh/v1/api_materialsbulk/materialsbulk",
    headers: {
      Authorization: `Bearer ${accesToken}`,
    },
    params,
  };

  const { trigger, data, loading, error } = useFetch(config);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(
    null
  );

  const setItem = (item: Record<string, any>) => {
    if (selectedItem === item) {
      setSelectedItem(null);
      setFieldValue(null);
      sdk.close();
      return;
    }
    setSelectedItem(item);
    setFieldValue(item);
    sdk.close();
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        trigger();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Box padding="spacingM" style={{ height: "100%" }}>
      {authLoading ? (
        <Flex justifyContent="center" alignItems="center">
          <Box>
            <Spinner customSize={50} />
          </Box>
        </Flex>
      ) : (
        <Fragment>
          <FormControl>
            <FormControl.Label>Search</FormControl.Label>
            <TextInput
              defaultValue=""
              name="search"
              type="text"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormControl>
          <Box padding="spacingM">
            {loading && <Spinner customSize={50} />}
            {error && <Paragraph>{error.message}</Paragraph>}
            <Stack flexDirection="column">
              {(data as IData)?.Results.map((item, index) => (
                <Fragment
                  key={`${index}-${item?.CDH?.header_record?.ObjectKey}`}
                >
                  <Card
                    onClick={() => setItem(item)}
                    isSelected={selectedItem === item}
                  >
                    <span role="img" aria-label="taco">
                      <Paragraph>
                        🌮 - {item?.CDH?.header_record?.ObjectKey} -{" "}
                        {
                          item?.CDH?.material_general_data
                            ?.material_description[0]?.MaterialDescription
                        }
                      </Paragraph>
                    </span>
                  </Card>
                </Fragment>
              ))}
            </Stack>
          </Box>
        </Fragment>
      )}
    </Box>
  );
};

export default Dialog;
