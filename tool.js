export async function processVueFile(filePath) {
  const response = await fetch(filePath);
  const vueFileContent = await response.text();

  const compiler = VueTemplateCompiler;
  if (!compiler) {
    throw new Error("VueTemplateCompiler is not defined");
  }

  const parsed = compiler.parseComponent(vueFileContent);

  const vueComponent = {
    data() {
      return {};
    },
    components: {},
    computed: {},
    props: {},
    watch: {},
    mounted() {},
    created() {},
    methods: {},
  };
  console.log(parsed);
  if (parsed.script && parsed.script.content) {
    // 处理 script 部分
    vueComponent.script = parsed.script.content;
  }

  if (parsed.template && parsed.template.content) {
    // 处理 template 部分
    vueComponent.template = parsed.template.content;
  }

  if (parsed.styles && parsed.styles.length > 0) {
    // 处理 style 部分
    vueComponent.style = parsed.styles[0].content;
  }
  //   style不生效怎么办

  return vueComponent;
}

export function convertVueSFC(text) {
  const compiler = VueTemplateCompiler;

  if (!compiler) {
    throw new Error("VueTemplateCompiler is not defined");
  }

  const parsed = compiler.parseComponent(text);

  let vueComponent = "";

  if (parsed.script && parsed.script.content) {
    let templateStr = `template: \`${parsed.template.content}\`,`;
    // 去掉 export default 和 前后括号
    // let scriptStr = parsed.script.content.replace(/export default/, "return");
    let scriptStr = parsed.script.content.replace(/export default \{/, `{ \n ${templateStr} \n `);
    vueComponent = scriptStr;
  }
  let styeContent = "";
  //   打印css
  const styleList = parsed.styles;
  if (styleList && styleList.length > 0) {
    styleList.forEach((style) => {
      //   console.log(style.content);
      styeContent += style.content;
    });
  }

  return {
    component: `<script> \n const MyComponent = ${vueComponent} \n </script> `,
    style: styeContent,
  };
}
