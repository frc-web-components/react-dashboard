import Dashboard from "@/dashboard";
import { store } from "@/store/app/store";
import {
  SourceTree,
  makeSelectSourceTree,
} from "@/store/selectors/sourceSelectors";

const selectSourceTree = makeSelectSourceTree();

interface ShuffleboardWidgetMetadata {
  preferredComponent?: string;
  size: [number, number];
  position: [number, number];
}

interface ShuffleboardWidget {
  metadata?: ShuffleboardWidgetMetadata;
  source?: {
    provider: string;
    key: string;
  };
}

interface ShuffleboardTab {
  name: string;
  widgets: ShuffleboardWidget[];
}

interface Shuffleboard {
  tabs: ShuffleboardTab[];
}

class RobotLayout {
  #dashboard: Dashboard;

  constructor(dashboard: Dashboard) {
    this.#dashboard = dashboard;

    let shuffleboardUpdate: number | undefined;

    store.subscribe(() => {
      const latestShuffleboardUpdate =
        store.getState().source.sourceUpdates?.["NT"]?.["/Shuffleboard"];
      if (shuffleboardUpdate !== latestShuffleboardUpdate) {
        this.#updateLayout();
      }
      shuffleboardUpdate = latestShuffleboardUpdate;
    });
  }

  #updateLayout() {
    const sourceTree = selectSourceTree(
      store.getState(),
      "NT",
      "/Shuffleboard"
    );
    const shuffleboard: Shuffleboard = {
      tabs: [],
    };
    if (sourceTree) {
      const metadata = sourceTree.childrenSources[".metadata"];
      if (metadata) {
        const tabsNames =
          (metadata?.childrenSources?.["Tabs"].value as string[]) ?? [];
        tabsNames.forEach((tabName) => {
          shuffleboard.tabs.push(this.#getTab(tabName, sourceTree, metadata));
        });
      }
    }
    this.#createLayout(shuffleboard);
  }

  #getTab(
    tabName: string,
    sources: SourceTree,
    metadata: SourceTree
  ): ShuffleboardTab {
    const shuffleboardTab: ShuffleboardTab = {
      name: tabName,
      widgets: [],
    };
    const tabMetadata = metadata.childrenSources[tabName];
    const tabSources: SourceTree | undefined = sources.childrenSources[tabName];

    const widgetMap: Record<string, ShuffleboardWidget> = {};

    if (tabMetadata) {
      Object.entries(tabMetadata.childrenSources).forEach(
        ([elementName, elementMetadata]) => {
          widgetMap[elementName] = {};
          widgetMap[elementName].metadata = {
            preferredComponent: elementMetadata.childrenSources[
              "PreferredComponent"
            ].value as string,
            size: elementMetadata.childrenSources["Size"].value as [
              number,
              number
            ],
            position: elementMetadata.childrenSources["Position"].value as [
              number,
              number
            ],
          };
        }
      );
    }
    if (tabSources) {
      Object.keys(tabSources.childrenSources).forEach((elementName) => {
        if (elementName.startsWith(".")) {
          return;
        }
        widgetMap[elementName] = widgetMap[elementName] ?? {};
        widgetMap[elementName].source = {
          provider: "NT",
          key: `/Shuffleboard/${tabName}/${elementName}`,
        };
      });
    }

    
    shuffleboardTab.widgets = Object.values(widgetMap);

    shuffleboardTab.widgets.forEach((widget) => {
      console.log("metadata?:", widget.metadata);
      if (widget.metadata) {
        return;
      }
      const metadata = this.#addDefaultMetadata(shuffleboardTab.widgets);
      widget.metadata = metadata
      console.log("METADATA:", metadata);
    });

    return shuffleboardTab;
  }

  #addDefaultMetadata(
    widgets: ShuffleboardWidget[]
  ): ShuffleboardWidgetMetadata {
    let x = 0;
    while (true) {
      let overlap = false;
      for (let { metadata } of widgets) {
        if (!metadata) {
          continue;
        }
        const { position, size } = metadata;
        if (position[0] >= x && x < position[0] + size[0]) {
          x += size[0];
          overlap = true;
        }
      }
      if (!overlap) {
        break;
      }
    } 
    return {
      position: [x, 0],
      size: [1, 1]
    }
  }

  #createLayout(shuffleboard: Shuffleboard) {
    console.log("shuffleboard:", shuffleboard);
    shuffleboard.tabs.forEach((tab) => {
      const dashboardTab = this.#dashboard.getTab(tab.name);
      if (!dashboardTab) {
        this.#dashboard.addTab(tab.name);
        tab.widgets.forEach(widget => {
          if (widget.metadata && widget.source) {
            const { position: [x, y], size: [width, height] } = widget.metadata!;
            const keyParts = widget.source.key.split('/');
            const name = keyParts[keyParts.length - 1];
            this.#dashboard.addElementToTab(tab.name, {
              position: { x, y },
              size: { width, height },
              type: 'booleanBox',
              source: widget.source,
              name,
            }); 
          }
        });
      }
    });
  }
}

export default RobotLayout;
