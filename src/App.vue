<template>
  <PropertyPanel
    v-on:message="handle_property_panel_message"
    v-bind:title="'Some Title'"
    ref="propertyPanel"
  />
</template>

<script>
import PropertyPanel from "./components/PropertyPanel.vue";
import * as backendComm from "./script/backendComm.js";

export default {
  name: "App",
  data() {
    return {
      content1: [
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
          condition: [
            { index: 1, comparison: "<", value: 54, file: "graphic/one.png" },
            {
              index: 2,
              comparison: "==",
              value: 100,
              file: "graphic/two.png",
            },
          ],
        },
      ],
      content2: [
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
          condition: [
            { index: 1, comparison: "<", value: 54, file: "graphic/one.png" },
            {
              index: 2,
              comparison: "==",
              value: 100,
              file: "graphic/two.png",
            },
          ],
        },
      ]
    };
  },
  components: {
    PropertyPanel,
  },
  methods: {
    handle_property_panel_message(message) {
      this.handle_message(message, "PropertyPanel");
    },
    handle_message(message, senderName) {
      switch (message.command) {
        case "S_OpenFile":
          console.log("Opening file: " + message.path);
          backendComm.get_file_content(message.path).then(
            (value) => this.handle_file_content(value.data, senderName),
            (error) => this.handle_error(error, senderName)
          );
          break;
      }
    },
    handle_file_content(fileContent) {
      if (fileContent.status === "good") {
        this.$refs.propertyPanel.catch_folder_content(fileContent.data.path, fileContent.data.files);
      } else {
        this.$refs.propertyPanel.catch_read_file_error();
      }
    },
    handle_error(error, sender) {
      console.log(sender);
      console.log(error);
    },
    change_to_content1() {
      this.$refs.propertyPanel.change_content(this.content1);
    },
    change_to_content2() {
      this.$refs.propertyPanel.change_content(this.content2);
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
