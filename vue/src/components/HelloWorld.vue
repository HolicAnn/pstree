<template>
  <div>
    <p class="info">蒋新的进程树</p>
    <a-tree show-line :tree-data="data" :replaceFields="replaceFields">
    </a-tree>
    <a class="copy" href="https://beian.miit.gov.cn">渝ICP备19012523号</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      replaceFields: {
        title: "title",
      },
      data: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.axios.get("/tree/tree").then((res) => {
        console.log(res);
        if (res && res.data) {
          this.data = res.data;
        }
      });
    },
  },
};
</script>

<style scoped>
.info {
  padding: 0;
  text-align: center;
  font-size: 30px;
}
.copy {
  position: absolute;
  bottom: 10px;
  text-align: center;
  left: 0;
  right: 0;
}
</style>
