<script>
export default {
  name: "custom-dropdown",
  props: {
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    keyName: {
      type: String,
      required: false,
      default: "name",
    },
    keyValue: {
      type: String,
      required: false,
      default: "id",
    },
  },
  template: `
    <div class="custom-select" :tabindex="tabindex" @blur="onBlurOutside($event)">
      <div class="selected" :class="{ open: open }" @click="open = !open" v-html="selected">
      </div>
      <div class="items" :class="{ selectHide: !open }">
        <div class="flex-row input-holder" :tabindex="tabindex">
          <input
            type="text"
            name="add-new-entity"
            placeholder="Start typing here"
            class="flex-60 add-input text-l"
            v-model="addInputText"
            @blur="onBlurOutside($event)"
          ></input>
          <div class="flex-40 button-div">
            <button
              type="button"
              class="btn-black plus"
              @blur="onBlurOutside($event)"
              @click="emitAdd"
            ></button>
          </div>
        </div>
        <div
          class="flex-row options"
          v-for="(option, i) of options"
          :key="i"
        >
          <div class="flex-40 editable">
            <input
              type="text"
              :value="option[keyName]"
              class="text-l edit-input"
              @blur="onBlurOutside($event)"
              @change="emitEdit($event, option)"
            >
              {{ option[keyName] }}
            </input>
          </div>
          <div 
            class="flex-60"
            @click="
              selected = option[keyName];
              open = false;
              $emit('input', option);
              emitSelect()
            "
          >&nbsp;</div>
          <div class="flex-40 button-div">
            <button
              type="button"
              class="btn-black minus"
              @blur="onBlurOutside($event)"
              @click="emitDelete(i)"
            ></button>
          </div>
        </div>
      </div>
    </div>
  `,
  data: function () {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
        ? this.options[0]
        : null,
      open: false,
      addInputText: "",
    };
  },
  computed: {},
  methods: {
    mounted() {
      this.$emit("input", this.selected);
    },
    onBlurOutside(e) {
      if (e.relatedTarget === null) this.open = false;
    },
    emitAdd() {
      this.$emit("onAdd", this.addInputText);
    },
    emitDelete(i) {
      const toBeDeletedId = this.options[i].id;
      this.$emit("onDelete", toBeDeletedId);
    },
    emitEdit(e, option) {
      const editedData = { ...option, value: e.target.value };
      this.$emit("onEdit", editedData);
      if(this.selected === option.name) this.selected = e.target.value;
    },
    emitSelect() {
      this.$emit("onSelect");
    }
  },
};
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  line-height: 36px;
  font-size: 14px;
  .selected {
    background-color: #d0e8ec;
    color: #000;
    padding-left: 1em;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 2em;

    &:after {
      position: absolute;
      content: "";
      top: 16px;
      right: 1em;
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-color: #000 transparent transparent transparent;
    }
  }

  .items {
    color: #000;
    overflow: hidden;
    position: absolute;
    background-color: #e3f1f3;
    left: 0;
    right: 0;
    z-index: 1;
    max-height: 300px;
    overflow-y: scroll;

    .input-holder {
      padding-top: 0.5em;
      padding-bottom: 0.5em;
      padding-left: 1em;

      .add-input {
        background-color: #fff;
        border: 1px solid #69a9b6;

        &::placeholder {
          text-align: left;
          color: #cccccc;
        }
      }
    }

    .add-input,
    .edit-input {
      padding-left: 0.5em;
      padding-right: 0.5em;
      font-size: 14px;;
    }

    .options {
      color: #000;
      padding-left: 1em;
      cursor: pointer;
      user-select: none;

      .editable {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          cursor: text;
        }

        .edit-input {
          background-color: #e3f1f3;
          border: 1px solid transparent;
          padding-left: 0em;

          &:focus {
            background-color: #fff;
            border: 1px solid #69a9b6;
            padding-left: 0.5em;
          }
        }
      }
    }
  }
}

.button-div {
  display: flex;
  justify-content: flex-end;
  margin-right: 0.5em;
}

.selectHide {
  display: none;
}
</style>