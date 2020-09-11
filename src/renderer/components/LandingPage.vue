<template>
  <div id="wrapper">
    <div class="nav-bar">
      <div class="search-box">
        <a-input-search
          size="large"
          placeholder="请输入要搜索的书籍名称"
          default-value="JavaScript"
          enter-button
          @search="onSearch"
        />
      </div>
      <div class="book-box">
        <a-button type="primary" icon="read" size="large" @click="$router.push('/books')">已下载书籍</a-button>
      </div>
    </div>

    <div class="search-ans">
      <a-table :columns="columns" :data-source="data" rowKey="id">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <img width="100px" :src="bookPic" slot="bookPic" slot-scope="bookPic" />
        <span slot="customTitle">
          <a-icon type="smile-o" />
          {{` ID`}}
        </span>

        <span
          slot="downloadInfos"
          style="width:400px;display:flex;"
          slot-scope="downloadInfos,title"
        >
          <a-button
            style="margin:5px"
            v-for="item in downloadInfos"
            type="primary"
            icon="download"
            :key="item.url"
            v-show="item.name.indexOf('epub')!=-1"
            @click="downloadFile(item,title)"
          >下载</a-button>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: "id",
    key: "id",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "书名",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "图片预览",
    dataIndex: "bookPic",
    key: "bookPic",
    slots: {
      title: "bookPic",
    },
    scopedSlots: {
      customRender: "bookPic",
    },
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "下载",
    key: "downloadInfos",
    dataIndex: "downloadInfos",
    slots: {
      title: "downloadInfos",
    },
    scopedSlots: {
      customRender: "downloadInfos",
    },
  },
];

const data = [];
const fs = require("fs");
export default {
  name: "landing-page",
  data() {
    return {
      data,
      columns,
    };
  },
  mounted() {},
  methods: {
    async onSearch(value) {
      let response = await this.$http.get(
        `https://www.shiyisoushu.com/api/search/v3?q=${encodeURI(value)}`
      );
      this.data = response.data.data.content.map((item) => {
        item.description = item.description + "...";
        return {
          ...item,
        };
      });
      console.log(this.data);
    },
    downloadFile(message, title) {
      // 设置路径
      if (!fs.existsSync("books")) {
        fs.mkdirSync("books");
      }
      // 进行下载
      const key = "updatable";
      this.$message.loading({
        content: `《${title.title}.${message.name}》开始下载 `,
        key,
        duration: 0,
      });
      try {
        this.$http({
          method: "get",
          url: message.url,
          responseType: "stream",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.44",
          },
        }).then((response) => {
          console.log(response);
          // console.log()
          let length = Number.parseInt(
            response.headers["content-length"] / 1024
          );
          response.data.pipe(
            fs.createWriteStream(`books/${title.title}.${message.name}`)
          );
          let cur = 0;
          response.data.on("data", (chunk) => {
            cur += Number.parseInt(chunk.length / 1024);
            this.$message.loading({
              content: `《${title.title}.${message.name}》正在下载中:
              当前进度：${cur}kB/${length}kB `,
              key,
              duration: 0,
            });
          });
          response.data.on("end", () => {
            this.$message.success({
              content: `《${title.title}.${message.name}》下载完成`,
              key,
              duration: 2,
            });
          });
        });
      } catch (error) {
        console.error(error);
        this.$message.error({
          content: `《${title.title}.${message.name}》下载失败`,
          key,
          duration: 2,
        });
        if (fs.existsSync(`books/${title.title}.${message.name}`)) {
          fs.unlinkSync(`books/${title.title}.${message.name}`);
        }
      }
    },
  },
};
</script>

<style>
#wrapper {
  padding: 30px;
}
.search-ans {
  margin-top: 20px;
}
.nav-bar {
  display: flex;
  justify-content: space-around;
  align-content: center;
  text-align: center;
}
.search-box {
  width: 70%;
}
</style>
