<template>
  <div class="books">
    <div class="back-btn">
      <a-button type="primary" icon="search" size="large" @click="$router.push('/')">书籍搜索下载</a-button>
    </div>
    <div class="book-list">
      <a-row :gutter="16">
        <a-col
          :span="4"
          v-for="(item,index) in coverList"
          @click="goDetail(item.epub)"
          :key="index"
        >
          <a-card hoverable :bordered="true">
            <img slot="cover" alt="example" :src="item.src" />
            <a-card-meta :title="item.title">
              <template slot="description">作者：{{item.creator}}</template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import fs from "fs";
const EPub = require("epub");
export default {
  data() {
    return {
      coverList: [],
    };
  },
  methods: {
    goDetail(epub) {
      this.$router.push({
        name: "book-detail",
        params: {
          epub,
        },
      });
    },
  },
  mounted() {
    if (!fs.existsSync("books")) {
      fs.mkdirSync("books");
    }
    let files = fs.readdirSync("books");
    files.forEach((file, index) => {
      let epub = new EPub("books/" + file);
      epub.on("end", () => {
        // console.log(epub.metadata);
        epub.getImage("cover", (error, data, mimeType) => {
          if (error) {
            console.error(error);
            return;
          }
          this.coverList.push({
            epub,
            title: epub.metadata.title,
            src: `data:${mimeType};base64,${data.toString("base64")}`,
            creator: epub.metadata.creator,
            publisher: epub.metadata.publisher,
          });
        });
      });
      epub.parse();
    });

    // 必须先调用Parse 才能使用其他方法和监听
  },
};
</script>

<style>
.books {
  padding: 20px;
}
.ant-card-meta-description {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: nowrap;
}
.back-btn{
  margin: 20px 0;
}
</style>