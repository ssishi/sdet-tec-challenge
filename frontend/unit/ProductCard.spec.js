import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import ProductCard from "@/components/ProductCard.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ProductCard.vue", () => {
  let store;
  let actions;
  let wrapper;

  const mockProduct = {
    id: 1,
    name: "Test Product",
    description: "Test Description",
    price: "19.99",
    stock_quantity: 10,
    image_url: "test.jpg",
    category_name: "Electronics",
  };

  beforeEach(() => {
    actions = {
      addToCart: jest.fn(),
    };
    store = new Vuex.Store({ actions });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  it("renders product information correctly", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    expect(wrapper.find("v-card-title").text()).toBe("Test Product");
    expect(wrapper.find("v-card-subtitle").text()).toBe("Electronics");
  });

  it("displays price with correct formatting", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    expect(wrapper.text()).toContain("$19.99");
  });

  it("shows add to cart button", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    const button = wrapper.find('[data-testid="add-to-cart-button"]');
    expect(button.exists()).toBe(true);
  });

  it("handles add to cart action", async () => {
    const mockRouter = { push: jest.fn() };
    const getters = { user: () => ({ id: 1 }) };
    store = new Vuex.Store({ actions, getters });

    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
      mocks: { $router: mockRouter },
    });

    const button = wrapper.find('[data-testid="add-to-cart-button"]');

    await button.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.addToCart).toHaveBeenCalled();
  });

  it("sets default quantity", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    const quantityInput = wrapper.find('[data-testid="quantity-input"]');
    expect(wrapper.vm.quantity).toBe(1);
    expect(quantityInput.attributes("max")).toBe("10");
  });

  it("handles stock quantity display", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    expect(wrapper.text()).not.toContain("Out of stock");
  });

  it("emits event when item added", async () => {
    const mockRouter = { push: jest.fn() };
    const getters = { user: () => ({ id: 1 }) };
    store = new Vuex.Store({ actions, getters });

    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
      mocks: { $router: mockRouter },
    });

    await wrapper.vm.handleAddToCart();
    expect(wrapper.emitted()["added-to-cart"]).toBeTruthy();
  });

  it("component mounts without errors", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    expect(wrapper.vm).toBeTruthy();
  });

  it("has correct data structure", () => {
    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
    });

    expect(wrapper.vm.$data.quantity).toBe(1);
    expect(wrapper.vm.$data.loading).toBe(false);
    expect(wrapper.vm.$props.product.name).toBe("Test Product");
  });

  it("calls addToCart with correct parameters", async () => {
    actions.addToCart.mockResolvedValue({ success: true });
    const mockRouter = { push: jest.fn() };
    const getters = { user: () => ({ id: 1 }) };
    store = new Vuex.Store({ actions, getters });

    wrapper = shallowMount(ProductCard, {
      localVue,
      store,
      propsData: { product: mockProduct },
      mocks: { $router: mockRouter },
    });

    await wrapper.vm.handleAddToCart();

    expect(actions.addToCart).toHaveBeenCalledWith(expect.any(Object), {
      productId: 1,
      quantity: 1,
    });
  });
});
