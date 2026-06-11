import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { PageContext } from "contexts";
import { useFilterContext, useMapContext } from "hooks";
import { AppButton } from "../AppButton";
import { api } from "services";
import { getAppName } from "../../runtime";

const ButtonOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const RegisterScenarioItem = ({ config, filterState, mapState }) => {
  const { apps, targetAppName, filter: filterParamName, path, appId } = config;
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const matchedFilter = mapState.filters?.find((f) => f.paramName === filterParamName);
  const filterValue = matchedFilter ? filterState[matchedFilter.id] : null;

  useEffect(() => {
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

  if (isRegistered) {
    return (
      <AlreadyRegisteredButton disabled>
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
    <ButtonOverlay>
      {configs.map((config, i) => (
        <RegisterScenarioItem
          key={i}
          config={config}
          filterState={filterState}
          mapState={mapState}
        />
      ))}
    </ButtonOverlay>
  );
};
