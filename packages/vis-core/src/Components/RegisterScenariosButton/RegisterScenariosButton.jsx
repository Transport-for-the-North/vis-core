import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { PageContext } from "contexts";
import { useFilterContext, useMapContext } from "hooks";
import { AppButton } from "../AppButton";
import { api } from "services";
import { getAppName } from "../../runtime";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
`;

const AlreadyRegisteredButton = styled(AppButton)`
  background-color: #c0392b;
  border-color: #c0392b;
  &:hover,
  &:focus {
    background-color: #c0392b;
    border-color: #c0392b;
  }
`;

const SuccessButton = styled(AppButton)`
  background-color: #27ae60;
  border-color: #27ae60;
  &:hover,
  &:focus {
    background-color: #27ae60;
    border-color: #27ae60;
  }
`;

const RegisterScenarioItem = ({ config, filterState, mapState }) => {
  const { apps, targetAppName, filter: filterParamName, path, appId } = config;
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  const matchedFilter = mapState.filters?.find((f) => f.paramName === filterParamName);
  const filterValue = matchedFilter ? filterState[matchedFilter.id] : null;

  useEffect(() => {
    // Reset the fresh-registration message whenever the selected scenario changes.
    setJustRegistered(false);
    if (!filterValue || !appId || !path) {
      setIsRegistered(false);
      return;
    }
    let cancelled = false;
    api.baseService
      .get(path, { queryParams: { appId, [filterParamName]: filterValue } })
      .then((res) => {
        if (!cancelled) setIsRegistered(res?.isRegistered ?? false);
      })
      .catch(() => {
        if (!cancelled) setIsRegistered(false);
      });
    return () => { cancelled = true; };
  }, [filterValue, appId, path, filterParamName]);

  if (!config.render) return null;
  if (apps && !apps.includes(getAppName())) return null;

  if (justRegistered) {
    return (
      <SuccessButton disabled $width="100%" $height="auto">
        Successfully registered {filterValue} to {targetAppName}
      </SuccessButton>
    );
  }

  if (isRegistered) {
    return (
      <AlreadyRegisteredButton disabled $width="100%" $height="auto">
        Selected scenario already registered to {targetAppName}
      </AlreadyRegisteredButton>
    );
  }

  const handleClick = async () => {
    if (!filterValue || isLoading) return;
    setIsLoading(true);
    setStatus(null);
    try {
      await api.baseService.post(path, null, { queryParams: { appId, [filterParamName]: filterValue } });
      setStatus("success");
      setIsRegistered(true);
      setJustRegistered(true);
    } catch {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  let label = `Register selected scenario to ${targetAppName}`;
  if (isLoading) label = "Registering...";
  else if (status === "error") label = "Failed — Retry";

  return (
    <AppButton
      onClick={handleClick}
      disabled={isLoading || !filterValue}
      $width="100%"
      $height="auto"
    >
      {label}
    </AppButton>
  );
};

export const RegisterScenariosButton = () => {
  const pageContext = useContext(PageContext);
  const { state: filterState } = useFilterContext();
  const { state: mapState } = useMapContext();

  const rawConfig = pageContext.config?.registerScenarios;
  if (!rawConfig) return null;

  const configs = Array.isArray(rawConfig) ? rawConfig : [rawConfig];

  return (
    <ButtonContainer>
      {configs.map((config, i) => (
        <RegisterScenarioItem
          key={i}
          config={config}
          filterState={filterState}
          mapState={mapState}
        />
      ))}
    </ButtonContainer>
  );
};
