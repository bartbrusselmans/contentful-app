import React, { Fragment, useEffect, useState } from "react";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import {
  Box,
  Card,
  Flex,
  FormControl,
  Modal,
  Paragraph,
  Spinner,
  Stack,
  TextInput,
} from "@contentful/f36-components";
import useAuthorization from "../../hooks/useAuthorization";
import useFetch from "../../hooks/useFetch";

type propsType = {
  sdk: FieldExtensionSDK;
  setFieldValue: (value: Record<string, any> | null) => void;
  isOpen: boolean;
  onClose: () => void;
};

interface IData {
  Total: number;
  Results: Record<string, any>[];
}

const ModalDialog = ({
  sdk,
  setFieldValue,
  isOpen,
  onClose,
}: propsType): JSX.Element => {
  const { data: auth } = useAuthorization(sdk);
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
    console.log("🚀 ~ file: DIALOG index.tsx ~ line 60 ~ setItem ~ item", item);
    if (selectedItem === item) {
      setSelectedItem(null);
      setFieldValue(null);

      return;
    }
    setSelectedItem(item);
    setFieldValue(item);
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        trigger();
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Modal isShown={isOpen} onClose={onClose}>
      <Modal.Header title="Modal title" onClose={() => onClose()} />
      <Modal.Content>
        <Box padding="spacingM" style={{ height: "100%" }}>
          {loading ? (
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
                        <Paragraph>
                          🌮 - {item?.CDH?.header_record?.ObjectKey} -{" "}
                          {
                            item?.CDH?.material_general_data
                              ?.material_description[0]?.MaterialDescription
                          }
                        </Paragraph>
                      </Card>
                    </Fragment>
                  ))}
                </Stack>
              </Box>
            </Fragment>
          )}
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default ModalDialog;
