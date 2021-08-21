<template>
  <div id="UI_Blocker" v-if="showMyself" v-on:click="showMyself=false"></div>
  <div v-if="showMyself" class="middle-popup">
    <table>
      <tr>
        <th>Style</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Text Color</td>
        <td><input type="text" v-model="style.textColor" /></td>
      </tr>
      <tr>
        <td>Bg Color</td>
        <td><input type="text" v-model="style.bgColor" /></td>
      </tr>
      <tr>
        <td>Font-Family</td>
        <td>
          <select v-model="style.fontFamily">
            <option>Serif</option>
            <option>Sans-serif</option>
            <option>Monospace</option>
            <option>Cursive</option>
            <option>Fantasy</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Font-Weight</td>
        <td>
          <select v-model="style.fontWeight">
            <option>Bolder</option>
            <option>Bold</option>
            <option>Normal</option>
            <option>Lighter</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Text-Align</td>
        <td>
          <select v-model="style.textAlign">
            <option>Left</option>
            <option>Center</option>
            <option>Right</option>
          </select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      style: {
      textColor: "#000000",
      bgColor: "#ffffff",
      fontWeight: "Bold",
      fontFamily: "Sans-serif",
      textAlign: "Center",
      },
      showMyself: false,
    };
  },
  methods: {
    show() {
      this.showMyself = true;
    },
    hide() {
      this.showMyself = false;
    },
    set_content(label, style) {
      this.style = style;
      console.log(label);
    },
    set_style() {
      this.$emit("message", { style: this.style });
    },
  },
};
</script>

<style scoped>
#UI_Blocker {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #aaaaaa;
  opacity: 0.5;
  z-index: 0;
}

select {
  width: 100%;
}

.middle-popup {
  position: fixed;
  background-color: lightblue;
  z-index: 501;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px;
}

</style>