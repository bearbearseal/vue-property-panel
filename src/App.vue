<template>
  <button v-on:click="change_to_content1">Content 1</button>
  <button v-on:click="change_to_content2">Content 2</button>
  <button v-on:click="change_to_content3">Content 3</button>
  <button v-on:click="change_to_content4">Content 4</button>
  <PropertyPanel
    v-on:message="handle_property_panel_message"
    v-bind:title="'Properties'"
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
      content1: {
        width: 50,
        height: 30,
        top: 20,
        left: 30,
        source: "Channel 1 Point 20",
        logic: {
          type: "graphic",
          path: "graphic",
          value: "graphic/default.png",
          condition: [
            { index: 1, comparison: "<", value: 54, file: "graphic/one_.png" },
            {
              index: 2,
              comparison: "==",
              value: 100,
              file: "graphic/two_.png",
            },
          ]
        },
      },
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
            { index: 1, comparison: "<", value: 54, file: "graphic/one_.png" },
            {
              index: 2,
              comparison: "==",
              value: 100,
              file: "graphic/two_.png",
            },
          ],
        },
      ],
      content3: {
        width: 80,
        height: 40,
        top: 100,
        left: 30,
        source: "Channel 2 Point 4",
        logic: {
          type: "label",
          value: "Normal",
          style: {
            textColor: "White",
            bgColor: "Navy",
            fontWeight: "Bolder",
            fontFamily: "Sans-serif",
            size: 14,
            textAlign: "Left",
          },
          condition: [
            {
              index: 1,
              comparison: ">",
              value: 100,
              label: "Out Of Range",
              style: {
                textColor: "DarkRed",
                bgColor: "LightPink",
                fontWeight: "Bold",
                fontFamily: "serif",
                size: 13,
                textAlign: "Left",
              },
            },
            {
              index: 2,
              comparison: ">",
              value: 65,
              label: "Very High",
              style: {
                textColor: "Brown",
                bgColor: "LightPink",
                fontWeight: "Bold",
                fontFamily: "Monospace",
                size: 12,
                textAlign: "Right",
              },
            },
            {
              index: 3,
              comparison: ">",
              value: 35,
              label: "High",
              style: {
                textColor: "DarkMagenta",
                bgColor: "SeaShell",
                fontWeight: "Normal",
                fontFamily: "Cursive",
                size: 11,
                textAlign: "Center",
              },
            },
            {
              index: 4,
              comparison: "<",
              value: -35,
              label: "Low",
              style: {
                textColor: "Teal",
                bgColor: "YellowGreen",
                fontWeight: "Lighter",
                fontFamily: "Monospace",
                size: 10,
                textAlign: "Right",
              },
            },
          ]
        }
      },
      content4: [
        { name: "name1", value: "value1", type: "text" },
        { name: "z-index", value: 20, type: "number" },
        {
          name: "name3",
          value: "value3",
          type: "file",
          path: "designer",
        },
        {
          name: "label1",
          type: "label",
          value: "Normal",
          style: {
            textColor: "White",
            bgColor: "Navy",
            fontWeight: "Bolder",
            fontFamily: "Sans-serif",
            size: 14,
            textAlign: "Left",
          },
          condition: [
            {
              index: 1,
              comparison: ">",
              value: 100,
              label: "Out Of Range",
              style: {
                textColor: "DarkRed",
                bgColor: "LightPink",
                fontWeight: "Bold",
                fontFamily: "serif",
                size: 13,
                textAlign: "Left",
              },
            },
            {
              index: 2,
              comparison: ">",
              value: 65,
              label: "Very High",
              style: {
                textColor: "Brown",
                bgColor: "LightPink",
                fontWeight: "Bold",
                fontFamily: "Monospace",
                size: 12,
                textAlign: "Right",
              },
            },
            {
              index: 3,
              comparison: ">",
              value: 35,
              label: "High",
              style: {
                textColor: "DarkMagenta",
                bgColor: "SeaShell",
                fontWeight: "Normal",
                fontFamily: "Cursive",
                size: 11,
                textAlign: "Center",
              },
            },
            {
              index: 4,
              comparison: "<",
              value: -35,
              label: "Low",
              style: {
                textColor: "Teal",
                bgColor: "YellowGreen",
                fontWeight: "Lighter",
                fontFamily: "Monospace",
                size: 10,
                textAlign: "Right",
              },
            },
          ],
        },
      ],
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
        this.$refs.propertyPanel.catch_folder_content(
          fileContent.data.path,
          fileContent.data.files
        );
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
    },
    change_to_content3() {
      this.$refs.propertyPanel.change_content(this.content3);
    },
    change_to_content4() {
      this.$refs.propertyPanel.change_content(this.content4);
    },
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
