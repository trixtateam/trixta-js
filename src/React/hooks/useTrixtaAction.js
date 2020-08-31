import { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
  makeSelectActionCommonForRole,
  makeSelectActionResponseInstancesForRole,
  makeSelectSchemaFormSettings,
  makeSelectHasRoleAccess,
} from '../selectors';

export default function useTrixtaAction(props) {
  const hasRoleAccessSelector = makeSelectHasRoleAccess();
  const commmonSelector = makeSelectActionCommonForRole();
  const schemaFormUISettingsSelector = makeSelectSchemaFormSettings();
  const instancesSelector = makeSelectActionResponseInstancesForRole();
  const common = useSelector((state) => commmonSelector(state, props), shallowEqual);
  const instances = useSelector((state) => instancesSelector(state, props), shallowEqual);
  const schemaFormUISettings = useSelector(
    (state) => schemaFormUISettingsSelector(state, props),
    shallowEqual
  );
  const hasRoleAccess = useSelector((state) => hasRoleAccessSelector(state, props), shallowEqual);

  useEffect(() => {}, [common, instances, schemaFormUISettings, hasRoleAccess]);

  return {
    common,
    instances,
    schemaFormUISettings,
    hasRoleAccess,
  };
}
