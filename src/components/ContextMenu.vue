<template>
  <div>
    <div
      id="context-menu"
      v-if="show"
      v-bind:style="{ top: top + 'px', left: left + 'px' }"
    >
      <div
        class="context-menu-item"
        v-for="item in optionList"
        v-bind:key="item.name"
        v-on:click="handle_item_click($event, item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div id="UI_Blocker" v-if="show" v-on:click="show = false"></div>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  props: ["optionList"],
  data() {
    return {
      left: 0, // left position
      top: 0, // top position
      show: false,
    };
  },
  methods: {
    close() {
      this.show = false;
    },
    open(top, left) {
      //let target = document.querySelector("#context-menu");
      this.left = left;
      this.top = top;
      this.show = true;
    },
    handle_item_click(event, item) {
      event.stopPropagation();
      this.$emit("message", {
        command: item.value,
        data: { position: { left: this.left, top: this.top } },
      });
      this.show = !item.close;
    },
  },
};
</script>

<style scoped>
#context-menu {
  position: fixed;
  background: white;
  outline: none;
  z-index: 501;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
.context-menu-item {
  padding: 4px;
  background-color: #ccddff;
  color: #445599;
}
.context-menu-item:hover {
  background-color: #445599;
  color: #ccddff;
}
#UI_Blocker {
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  z-index: 500;
}
</style>