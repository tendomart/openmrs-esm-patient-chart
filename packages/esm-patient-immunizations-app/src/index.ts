import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink, getPatientSummaryOrder } from '@openmrs/esm-patient-common-lib';
import { configSchema } from './config-schema';
import { dashboardMeta } from './dashboard.meta';

const moduleName = '@openmrs/esm-patient-immunizations-app';

const options = {
  featureName: 'patient-immunizations',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const immunizationsOverview = () =>
  getAsyncLifecycle(() => import('./immunizations/immunizations-overview.component'), options);

export const immunizationsDetailedSummary = () =>
  getAsyncLifecycle(() => import('./immunizations/immunizations-detailed-summary.component'), options);

export const immunizationsDashboardLink = () =>
  // t('immunizations_link', 'Immunizations')
  getSyncLifecycle(
    createDashboardLink({
      ...dashboardMeta,
      title: () =>
        Promise.resolve(
          window.i18next?.t('immunizations_link', { defaultValue: 'Immunizations', ns: moduleName }) ?? 'Immunizations',
        ),
    }),
    options,
  );

export const immunizationsForm = () =>
  getAsyncLifecycle(() => import('./immunizations/immunizations-form.component'), options);
