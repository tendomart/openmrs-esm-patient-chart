import React from "react";
import { RouteComponentProps } from "react-router";
import styles from "./patient-chart-summary.css";
import DimensionsCard from "./documentation/dimensions-card.component";
import VitalsCard from "./documentation/vitals-card.component";
import ConditionsCard from "../widgets/conditions/conditions-card.component";
import AllergyCard from "../widgets/allergies/allergy-card.component";
import NotesCard from "../widgets/notes/notes-card.component";
import ProgramsCard from "../widgets/programs/programs-card.component";
import MedicationsSummary from "../widgets/medications/medications-summary.component";

export default function PatientChartSummary(props: PatientChartSummaryProps) {
  const [widgets, setWidgets] = React.useState([]);

  React.useEffect(() => {
    //an example config as we await for config module to be completed
    const exampleConfig: configType[] = [
      { name: "conditions" },
      {
        name: "Programs",
        esModule: "@jj-widgets",
        exportName: "programsWidget"
      },
      { name: "medications" },
      { name: "allergies" },
      { name: "notes" },
      { name: "vitals" },
      { name: "heightAndWeight" }
    ];

    //an example config as we await for config module to be completed
    const config: configType[] = [
      { name: "conditions" },
      { name: "medications" },
      { name: "allergies" },
      { name: "notes" },
      { name: "vitals" },
      { name: "heightAndWeight" },
      { name: "programs" }
    ];

    const coreComponents = {
      conditions: ConditionsCard,
      programs: ProgramsCard,
      allergies: AllergyCard,
      notes: NotesCard,
      vitals: VitalsCard,
      heightAndWeight: DimensionsCard,
      medications: MedicationsSummary
    };

    const modulePromises = [];

    config.map(c => {
      if (c["esModule"]) {
        modulePromises.push(System.import(c.esModule));
      }
    });

    //@ts-ignore
    Promise.allSettled(modulePromises).then(modules => {
      const importedWidgets = [];
      let moduleWidgets = {};
      modules.map(m => {
        if (m.status === "fulfilled") {
          moduleWidgets = Object.assign(moduleWidgets, m.value.widgets);
        }
      });

      config.map(c => {
        c["esModule"]
          ? widgets.push(moduleWidgets[c.exportName].root)
          : widgets.push(coreComponents[c.name]);
      });
      setWidgets(widgets);
    });
  }, []);

  return (
    <main className="omrs-main-content">
      <div className={styles.patientChartCardsContainer}>
        <div className={styles.patientChartCards}>
          {widgets.length > 0 &&
            widgets.map((R, key) => {
              return <R key={key} />;
            })}
        </div>
      </div>
    </main>
  );
}

type PatientChartSummaryProps = RouteComponentProps & {};
