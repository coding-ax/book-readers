<template>
  <div id="wrapper">
    <a-button type="primary" icon="arrow-left" size="large" @click="$router.push('/books')">已下载书籍</a-button>
    <div class="container">
      <div class="container-left">
        <a-menu style="width: 256px" :default-selected-keys="['1']" mode="inline">
          <a-menu-item @click="toggleChange(item)" v-for="(item,index) in chapter" :key="index">
            <span>
              <a-icon type="menu-unfold" />
              <span>{{item.title}}</span>
            </span>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="container-right" v-html="content"></div>
    </div>
  </div>
</template>

<script>
import cheerio from "cheerio";
export default {
  data() {
    return {
      chapter: [],
      epub: null,
      content: "",
      css: "",
      imgObj: {},
    };
  },
  methods: {
    toggleChange(book) {
      this.epub.getChapterRaw(book.id, (err, text) => {
        if (err) {
          console.log(err);
          return;
        }
        const $ = cheerio.load(text);
        this.epub.getFile("css", (err, data) => {
          if (err) {
            console.log(err);
            return;
          } else {
            $("head").append(`<style>${data.toString()}</style>`);
          }
        });
        $("img").each((index, item) => {
          let src = $(item).attr("src");
          src = src.slice(3, src.length);
          console.log(src);
          let imgID = this.imgObj[src].id;
          $(item).attr("src", "");
          this.epub.getImage(imgID, (err, data, mimetype) => {
            if (err) {
              console.log(err);
            } else {
              let imgUrl = `data:${mimetype};base64,${data.toString("base64")}`;
              $(item).attr("src", imgUrl);
              this.content = $.html();
            }
          });
        });
        this.content = $.html();
      });
    },
  },
  mounted() {
    if (!this.$route.params.epub) {
      this.$router.push("/books");
    } else {
      console.log(this.$route.params);
      this.epub = this.$route.params.epub;
      // 对key进行裁剪
      for (let key in this.epub.manifest) {
        if (this.epub.manifest[key].href.indexOf("OEBPS/") != -1) {
          let href = this.epub.manifest[key].href;
          href = href.splice(6, href.length);
          this.imgObj[href] = this.epub.manifest[key];
        } else {
          let href = this.epub.manifest[key].href;
          this.imgObj[href] = this.epub.manifest[key];
        }
      }
      this.chapter = this.epub.flow.filter((item) => {
        return item.title;
      });
      this.epub.getImage("cover", (err, data, mimetype) => {
        if (err) {
          console.log(err);
          return;
        }
        this.content = `<img src="data:${mimetype};base64,${data.toString(
          "base64"
        )}" />`;
      });
    }
  },
};
</script>

<style>
body::-webkit-scrollbar {
    display: none;
}
#wrapper {
  padding: 30px;
}
.container {
  display: flex;
  margin-top: 20px;
  /* max-height: 100vh; */
  /* overflow: scroll;   */
}
.container-left {
  width: 257px;
  height: 80vh;
  overflow-y: scroll;
}
.container-right {
  overflow-y: scroll;
  padding: 15px;
  height: 80vh;
  width: 70%;
}
</style>