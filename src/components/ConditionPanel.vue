<template>
  <div id="UI_Blocker" v-if="showMyself" v-on:click="showMyself=false"></div>
  <div id="ConditionPanel" v-if="showMyself">
    <div id="Title">{{ title }}</div>
    <table id="ConditionTable">
      <tr>
        <th>+/-</th>
        <th>#</th>
        <th>cmp</th>
        <th>value</th>
        <th>{{ type }}</th>
      </tr>
      <tr>
        <td
          class="RemoveCondition BorderedTd"
          v-on:click="show_add_menu($event)"
        >
          +/-
        </td>
        <td class="NumberColumn BorderedTd">-</td>
        <td class="CompareColumn BorderedTd"></td>
        <td class="ValueColumn BorderedTd">default</td>
        <td v-if="conditionData.type == 'graphic'" class="BorderedTd">
          <table>
            <tr>
              <td>
                <input
                  type="text"
                  v-model="conditionData.value"
                  v-on:change="handle_input_change(0, 'output')"
                />
              </td>
              <td>
                <button v-on:click="default_value_browse_click()">...</button>
              </td>
            </tr>
          </table>
        </td>
        <td v-if="conditionData.type == 'label'" class="BorderedTd">
          <table>
            <tr>
              <td>
              <input
                v-model="conditionData.value"
                v-bind:style="{
                  border: 'none',
                  color: conditionData.style.textColor,
                  'background-color': conditionData.style.bgColor,
                  'font-weight': conditionData.style.fontWeight,
                  'font-family': conditionData.style.fontFamily,
                  'font-size': conditionData.style.size,
                  'text-align': conditionData.style.textAlign
                }"
              />
              </td>
              <td>
                <button v-on:click="handle_style_click(conditionData.value, typeData)">|||</button>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr v-for="item in conditionData.condition" v-bind:key="item.index">
        <td
          class="RemoveCondition BorderedTd"
          v-on:click="show_add_remove_menu($event, item)"
        >
          +/-
        </td>
        <td class="NumberColumn BorderedTd">{{ item.index }}</td>
        <td class="CompareColumn BorderedTd">
          <select
            v-model="item.comparison"
            v-on:change="handle_input_change(item.index, 'comparison')"
          >
            <option>==</option>
            <option>!=</option>
            <option>></option>
            <option>>=</option>
            <option>&lt;=</option>
            <option>&lt;</option>
          </select>
        </td>
        <td class="ValueColumn BorderedTd">
          <input
            class="ValueInput"
            type="number"
            size="7"
            v-model="item.value"
            v-on:change="handle_input_change(item.index, 'value')"
          />
        </td>
        <td v-if="conditionData.type == 'graphic'" class="BorderedTd">
          <table class="Borderless">
            <tr class="Borderless">
              <td class="Borderless">
                <input
                  type="text"
                  v-model="item.file"
                  v-on:change="handle_input_change(item.index, 'output')"
                />
              </td>
              <td class="Borderless">
                <button v-on:click="handle_browse_click(item)">...</button>
              </td>
            </tr>
          </table>
        </td>
        <td v-if="conditionData.type == 'label'" class="BorderedTd">
          <table class="Borderless">
            <tr>
              <td style="width:100%">
              <input
                v-bind:style="{
                  border: 'none',
                  color: item.style.textColor,
                  'background-color': item.style.bgColor,
                  'font-weight': item.style.fontWeight,
                  'font-family': item.style.fontFamily,
                  'font-size': item.style.size,
                  'text-align': item.style.textAlign
                }"
                v-model="item.label"
              />
              </td>
              <td>
                <button v-on:click="handle_style_click(item.label, item.style)">
                  |||
                </button>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  <ContextMenu
    class="ContextMenu"
    ref="addRemoveMenu"
    v-bind:optionList="[
      { name: 'Add Before', value: 'AddBefore', close: true },
      { name: 'Add After', value: 'AddAfter', close: true },
      { name: 'Delete', value: 'Delete', close: true },
    ]"
    v-on:message="catch_message"
  />
  <ContextMenu
    class="ContextMenu"
    ref="addMenu"
    v-bind:optionList="[{ name: 'Add After', value: 'AddAfter', close: true }]"
    v-on:message="catch_message"
  />
  <TextStyle ref="textStylePanel" />
</template>

<script>
import ContextMenu from "./ContextMenu.vue";
import TextStyle from "./TextStyle.vue";

export default {
  emits: ["message"],
  components: { ContextMenu, TextStyle },
  data() {
    return {
      type: "graphic",
      conditionData: {},
      showMyself: false,
      focusedItem: { isDefault: false, item: null },
    };
  },
  methods: {
    catch_message(message) {
      console.log("ConditionPanel caught message");
      console.log(message);
      this.showBlocker = false;
      switch (message.command) {
        case "SelectFile":
          if (this.focusedItem.isDefault) {
            this.conditionData.value = message.name;
            this.$emit("message", {
              command: "UpdateCondition",
              name: "output",
              index: 0,
            });
          } else {
            this.focusedItem.item.file = message.name;
            this.$emit("message", {
              command: "UpdateCondition",
              name: "output",
              index: this.focusedItem.item.index,
            });
          }
          break;
        case "AddBefore":
          console.log(this.focusedItem.item.index);
          this.insert_condition(this.focusedItem.item.index - 1);
          this.$emit("message", {
            command: "InsertCondition",
            index: this.focusedItem.item.index - 1,
          });
          break;
        case "AddAfter":
          if (this.focusedItem.isDefault) {
            this.insert_condition(0);
            this.$emit("message", { command: "InsertCondition", index: 0 });
          } else {
            this.insert_condition(this.focusedItem.item.index);
            this.$emit("message", {
              command: "InsertCondition",
              index: this.focusedItem.item.index,
            });
          }
          break;
        case "Delete":
          this.delete_condition(this.focusedItem.item.index - 1);
          this.$emit("message", {
            command: "DeleteCondition",
            index: this.focusedItem.item.index - 1,
          });
          break;
      }
    },
    show() {
      this.showMyself = true;
    },
    hide() {
      this.showMyself = false;
    },
    set_condition(title, conditionData) {
      this.title = title;
      this.conditionData = conditionData;
    },
    insert_condition(_index) {
      console.log("Inserting to " + _index);
      console.log(this.conditionData.condition);
      this.conditionData.condition.splice(_index, 0, {
        index: _index + 1,
        comparison: "==",
        value: 0,
        file: "graphic/default.png",
      });
      for (let i = _index + 1; i < this.conditionData.condition.length; ++i) {
        this.conditionData.condition[i].index += 1;
      }
    },
    delete_condition(_index) {
      this.conditionData.condition.splice(_index, 1);
      for (let i = _index; i < this.conditionData.condition.length; ++i) {
        this.conditionData.condition[i].index -= 1;
      }
    },
    handle_input_change(_index, _name) {
      console.log("handle input change");
      this.$emit("message", {
        command: "UpdateCondition",
        name: _name,
        index: _index,
      });
    },
    handle_browse_click(_item) {
      this.focusedItem.item = _item;
      this.focusedItem.isDefault = false;
      if (_item.file.length == 0) {
        this.$emit("message", {
          command: "BrowseFolder",
          path: this.path,
        });
      }
      let index = _item.file.lastIndexOf("/");
      let tempPath = "";
      if (index !== -1) {
        tempPath = _item.file.substring(0, index);
      }
      this.$emit("message", {
        command: "BrowseFolder",
        path: tempPath,
      });
    },
    default_value_browse_click() {
      this.focusedItem.item = null;
      this.focusedItem.isDefault = true;
      if(this.conditionData.value.length == 0) {
        this.$emit("message", {
          command: "BrowseFolder",
          path: this.path,
        });
      }
      let index = this.conditionData.value.lastIndexOf("/");
      let tempPath = "";
      if (index !== -1) {
        tempPath = this.conditionData.value.substring(0, index);
      }
      this.$emit("message", {
        command: "BrowseFolder",
        path: tempPath,
      });
    },
    handle_style_click(label, style) {
      this.$refs.textStylePanel.set_content(label, style);
      this.$refs.textStylePanel.show();
    },
    handle_add_condition() {
      console.log("Add condition");
    },
    show_add_remove_menu(event, item) {
      console.log("Clicked");
      this.$refs.addRemoveMenu.open(event.clientY, event.clientX);
      this.focusedItem.item = item;
      this.focusedItem.isDefault = false;
      this.showBlocker = true;
    },
    show_add_menu(event) {
      console.log("Clicked");
      this.$refs.addMenu.open(event.clientY, event.clientX);
      this.focusedItem.item = null;
      this.focusedItem.isDefault = true;
      this.showBlocker = true;
    },
    hide_context_menu() {
      this.showBlocker = false;
      this.$refs.addRemoveMenu.close();
      this.$refs.addMenu.close();
    },
  },
};
</script>

<style scoped>
#ConditionPanel {
  width: 380px;
}

.NumberColumn {
  width: 20px;
}

.CompareColumn {
  width: 30px;
}

.ValueColumn {
  width: 40px;
}

.AddCondition {
  color: darkgreen;
  font-size: 16px;
  font-weight: bold;
  height: 20px;
}

.AddCondition:hover {
  background-color: palegreen;
  cursor: pointer;
}

.RemoveCondition {
  color: darkgreen;
  font-size: 16px;
  font-weight: bold;
  height: 20px;
}

.RemoveCondition:hover {
  background-color: palegreen;
  cursor: pointer;
}

#ConditionTable {
  border-collapse: collapse;
  width: 100%;
}

#ConditionTable th {
  background-color: #dddddd;
  color: #444444;
  border: 1px solid black;
  padding: 3px 4px 1px 4px;
}

.BorderedTd {
  border: 1px solid black;
  font-size: 12px;
  padding: 0px 2px 0px 2px;
}

.ValueInput {
  width: 94%;
  font-size: 12px;
  border: none;
  border-color: transparent;
}

select {
  font-weight: bold;
}

input {
  text-align: center;
  border: none;
  width: 100%;
  border-color: transparent;
}

#Title {
  background-color: #001060;
  padding: 2px;
  color: #dddddd;
}

.Borderless {
  border: none;
}

.ContextMenu {
  z-index: 201;
}

#UI_Blocker {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 1;
  z-index: -1;
}

</style>