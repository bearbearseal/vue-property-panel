<template>
  <div id="PropertyPanel">
    <table>
      <tr>
        <td id="Toggler" v-on:click="handle_toggler_clicked">
          {{ togglerSymbol }}
        </td>
        <td v-if="showMain">
          <div id="Title">{{ title }}</div>
          <table id="PropertyTable">
            <tr v-for="(value, name) in properties" v-bind:key="name">
              <td>{{ name }}</td>
              <td v-if="typeof value == 'string'">
                <input
                  type="text"
                  v-bind:value="value"
                  v-on:change="handle_property_change(name, $event)"
                />
              </td>
              <td v-if="typeof value == 'number'">
                <input
                  type="number"
                  v-bind:value="value"
                  v-on:change="handle_property_change(name, $event)"
                />
              </td>
              <td v-if="typeof value == 'object'" class="value-entry">
                <table v-if="value.type == 'graphic'">
                  <tr>
                    <td style="border: none">
                      <input
                        style="width: 100%"
                        type="text"
                        v-model="value.value"
                      />
                    </td>
                    <td style="border: none">
                      <button
                        style="padding-left: 5px; padding-right: 5px"
                        v-on:click="show_condition_panel($event, value)"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                </table>
                <table v-if="value.type == 'label'">
                  <tr>
                    <td
                      v-bind:style="{
                        width: '100%',
                        border: 'none',
                        color: value.style.textColor,
                        'background-color': value.style.bgColor,
                        'font-weight': value.style.fontWeight,
                        'font-family': value.style.fontFamily,
                        'font-size': value.style.size,
                        'text-align': value.style.textAlign,
                      }"
                    >
                      {{ value.value }}
                    </td>
                    <td style="border: none">
                      <button
                        style="padding-left: 5px; padding-right: 5px"
                        v-on:click="show_condition_label($event, value)"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                </table>
                <table v-if="value.type == 'file'">
                  <tr>
                    <td style="border: none">
                      <input style="width:100%" type="text" v-bind:value="value.value" v-on:change="handle_object_property_change(name, $event)" />
                    </td>
                    <td style="border: none">
                      <button v-on:click="handle_browse_click(value)">
                        ...
                      </button>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!--
            <tr v-for="item in properties.global" v-bind:key="item.name">
              <td>{{ item.name }}</td>
              <td class="value-entry" v-if="item.type == 'file'">
                <table>
                  <tr>
                    <td style="border: none">
                      <input type="text" v-model="item.value" />
                    </td>
                    <td style="border: none">
                      <button v-on:click="handle_browse_click(item)">
                        ...
                      </button>
                    </td>
                  </tr>
                </table>
              </td>
              <td class="value-entry">
                <input type="text" v-on:change="handle_property_change()">
              </td>
              <td
                class="value-entry"
                v-if="item.type == 'text' || item.type == 'number'"
              >
                <input
                  style="width: 98%"
                  v-bind:type="item.type"
                  v-model="item.value"
                />
              </td>
              <td class="value-entry" v-if="item.type == 'graphic'">
                <table>
                  <tr>
                    <td style="border: none">
                      <input
                        style="width: 100%"
                        type="text"
                        v-model="item.value"
                      />
                    </td>
                    <td style="border: none">
                      <button
                        style="padding-left: 5px; padding-right: 5px"
                        v-on:click="show_condition_panel($event, item)"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                </table>
              </td>
              <td class="value-entry" v-if="item.type == 'label'">
                <table>
                  <tr>
                    <td
                      v-bind:style="{
                        width: '100%',
                        border: 'none',
                        color: item.style.textColor,
                        'background-color': item.style.bgColor,
                        'font-weight': item.style.fontWeight,
                        'font-family': item.style.fontFamily,
                        'font-size': item.style.size,
                        'text-align': item.style.textAlign,
                      }"
                    >
                      {{ item.value }}
                    </td>
                    <td style="border: none">
                      <button
                        style="padding-left: 5px; padding-right: 5px"
                        v-on:click="show_condition_label($event, item)"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            -->
          </table>
        </td>
      </tr>
    </table>
  </div>
  <div v-if="showFileBrowser" class="middle-popup">
    <FileExplorer v-on:message="catch_explorer_message" ref="fileExplorer" />
  </div>
  <div
    id="conditionContainer"
    v-bind:style="{ top: conditionPos.top + 'px', right: 10 + 'px' }"
  >
    <ConditionPanel
      v-on:message="capture_condition_message"
      ref="conditionPanel"
    />
  </div>
  <div v-if="showBlocker" id="UI_Blocker"></div>
</template>

<script>
import ConditionPanel from "./ConditionPanel.vue";
import FileExplorer from "./FileExplorer.vue";

export default {
  components: {
    FileExplorer,
    ConditionPanel,
  },
  emits: ["message"],
  props: ["title"],
  data() {
    return {
      showMain: false,
      togglerSymbol: "+",
      showFileBrowser: false,
      showTextStyle: false,
      activeProperty: null,
      showBlocker: false,
      showConditionPanel: false,
      conditionPos: { top: 0, right: 0 },
      //properties: [],
      folderOpener: { component: null, property: null },
      properties: {},
    };
  },
  methods: {
    catch_message(message) {
      console.log("PropertyPanel caught message");
      console.log(message);
      switch (message.command) {
        case "R_OpenFile":
          if (message.status === "Good") {
            this.$refs.fileExplorer.change_content(
              message.data.path,
              message.data.files
            );
          }
          break;
        case "UpdateProperties":
          this.properties = message.data;
          break;
        case "SelectFile":
          console.log(this.folderOpener.property);
          this.folderOpener.property.value = message.name;
          break;
      }
    },
    show_condition_panel(event, conditionData) {
      this.$refs.conditionPanel.show();
      this.conditionPos = { top: event.clientY + 6, right: 10 };
      this.$refs.conditionPanel.set_condition(
        "Graphic Conditions",
        conditionData
      );
      this.$refs.conditionPanel.show();
    },
    show_condition_label(event, conditionData) {
      this.$refs.conditionPanel.show();
      this.conditionPos = { top: event.clientY + 6, right: 10 };
      this.$refs.conditionPanel.set_condition(
        "Label Conditions",
        conditionData
      );
      this.$refs.conditionPanel.show();
    },
    catch_folder_content(path, files) {
      this.$refs.fileExplorer.change_content(path, files);
    },
    catch_read_file_error() {
      this.selectedProperty.value = "###";
      this.showBlocker = false;
    },
    change_content(properties) {
      this.properties = properties;
    },
    handle_browse_click(item) {
      //this.$emit("message", { command: "ItemClicked", data: typeData });
      //console.log(item);
      this.showBlocker = true;
      this.showFileBrowser = true;
      this.folderOpener.component = this;
      this.folderOpener.property = item;
      //this.selectedProperty = item;
      this.$emit("message", {
        command: "S_OpenFile",
        path: item.path,
      });
    },
    handle_toggler_clicked() {
      this.showMain = !this.showMain;
      if (this.showMain) {
        this.togglerSymbol = "-";
        this.$emit("message", { command: "S_Show" });
      } else {
        this.togglerSymbol = "+";
        this.$emit("message", { command: "S_Hide" });
      }
    },
    catch_explorer_message(message) {
      console.log("PropertyPanel got message");
      console.log(message);
      switch (message.command) {
        case "OpenFolder":
          this.$emit("message", { command: "S_OpenFile", path: message.name });
          break;
        case "SelectFile":
          this.folderOpener.component.catch_message(message);
          this.folderOpener.component = null;
          this.showFileBrowser = false;
          this.showBlocker = false;
          break;
        case "Cancel":
          this.showFileBrowser = false;
          this.showBlocker = false;
          break;
      }
    },
    capture_condition_message(message) {
      console.log("Message from condition panel");
      console.log(message);
      switch (message.command) {
        case "UpdateContent":
          break;
        case "BrowseFolder":
          this.showBlocker = true;
          this.showFileBrowser = true;
          this.folderOpener.component = this.$refs.conditionPanel;
          this.folderOpener.property = message.property;
          //this.selectedProperty = item;
          this.$emit("message", {
            command: "S_OpenFile",
            path: message.path,
          });
          break;
        case "InsertCondition":
          console.log(this.condition);
          break;
        case "DeleteCondition":
          console.log(this.condition);
          break;
        default:
          break;
      }
    },
    handle_property_change(name, event) {
      this.properties[name] = event.target.value;
    }
  },
};
</script>

<style scoped>
#PropertyTable {
  border-collapse: collapse;
  z-index: 100;
}

#PropertyTable td {
  border: 1px solid black;
  font-size: 10px;
}

input {
  border: none;
  border-color: transparent;
}

.value-entry {
  background-color: white;
  width: 128px;
  white-space: nowrap;
}

#PropertyPanel {
  float: right;
  background-color: #dddddd;
}

#Title {
  float: top;
  background-color: #001060;
  color: #dddddd;
}

#Toggler {
  cursor: pointer;
  background-color: #222222;
  color: #dddddd;
  width: 12px;
  font-size: 12px;
}

#Toggler:hover {
  background-color: #444444;
}

.middle-popup {
  position: absolute;
  background-color: lightblue;
  z-index: 501;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px;
}

#UI_Blocker {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #aaaaaa;
  opacity: 0.5;
  z-index: 500;
}

#conditionContainer {
  position: absolute;
  z-index: 400;
}
</style>