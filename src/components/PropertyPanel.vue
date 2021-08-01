<template>
  <button v-on:click="change_to_content1">Content 1</button>
  <button v-on:click="change_to_content2">Content 2</button>
  <div id="PropertyPanel">
    <table>
      <tr>
        <td id="Toggler" v-on:click="handle_toggler_clicked">
          {{ togglerSymbol }}
        </td>
        <td v-if="showMain">
          <div id="Title">{{ title }}</div>
          <table id="PropertyTable">
            <tr v-for="item in properties" v-bind:key="item.name">
              <td>{{ item.name }}</td>
              <!--<td class="value-entry" contenteditable="true">{{ item.value }}</td>-->
              <td class="value-entry" v-if="item.type == 'file'">
                <div>
                  <input type="text" v-model="item.value" />
                  <button v-on:click="handle_browse_click(item)">...</button>
                </div>
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
                <div>
                  <input type="text" v-model="item.value" />
                  <button
                    style="padding-left: 5px; padding-right: 5px"
                    v-on:click="show_condition_panel($event, item.condition)"
                  >
                    +
                  </button>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  <div v-if="showFileBrowser" class="middle-popup">
    <FileExplorer v-on:message="catch_explorer_message" ref="fileExplorer" />
  </div>
  <div
    v-if="showConditionPanel"
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
import FileExplorer from "./FileExplorer.vue";
import ConditionPanel from "./ConditionPanel.vue";
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
      activeProperty: null,
      showBlocker: false,
      showConditionPanel: false,
      conditionPos: { top: 0, right: 0 },
      properties: [
        { name: "name1", value: "value1", type: "text" },
        { name: "name2", value: "1234", type: "number" },
        {
          name: "name3",
          value: "value3",
          type: "file",
          path: "designer",
        },
        {
          name: "logic",
          type: "graphic",
          value: "graphic/default.png",
          path: "graphic",
        },
      ],
      //selectedProperty: null,
      folderOpener: { component: null, property: null },
      condition: [
        { index: 1, comparison: "<", value: 99, file: "graphic/one.png" },
        {
          index: 2,
          comparison: "==",
          value: 22,
          file: "graphic/two.png",
        },
        {
          index: 3,
          comparison: "!=",
          value: 22,
          file: "graphic/three.png",
        },
      ],
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
    show_condition_panel(event, condition) {
      switch (event.target.innerText) {
        case "+":
          event.target.innerText = "--";
          this.showConditionPanel = true;
          this.conditionPos = { top: event.clientY + 6, right: 10 };
          this.conditionData = {};
          this.conditionData.title = "Conditions";
          this.conditionData.type = "graphic";
          this.conditionData.path = "graphic";
          this.conditionData.value = "graphic/default.png";
          this.conditionData.conditions = condition;
          break;
        case "--":
          event.target.innerText = "+";
          this.showConditionPanel = false;
          break;
      }
    },
    catch_folder_content(path, files) {
      this.$refs.fileExplorer.change_content(path, files);
    },
    catch_read_file_error() {
      this.selectedProperty.value = "###";
      this.showBlocker = false;
    },
    change_content(_properties) {
      this.properties = _properties;
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
          /*
          if (this.selectedProperty.file == undefined) {
            this.selectedProperty.value = message.name;
          } else {
            this.selectedProperty.file = message.name;
          }
          this.selectedProperty = null;
          */
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
      console.log("ConditionPanel got message");
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
    change_to_content1() {
      this.$refs.conditionPanel.set_condition(this.condition);
    },
    change_to_content2() {
      this.$refs.conditionPanel.set_condition(this.condition);
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
  background-color: lightblue;
  position: absolute;
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