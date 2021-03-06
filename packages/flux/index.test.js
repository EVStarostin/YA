"use strict";
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-empty */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("./index");
describe("createStore", () => {
    it("у объекта, возвращаемого функцией createStore, есть методы getState, dispatch, subscribe и unsubscribe", () => {
        const initialState = {};
        const reducer = () => ({});
        const store = index_1.createStore(reducer, initialState);
        chai_1.expect(store).to.have.all.keys("getState", "dispatch", "subscribe", "unsubscribe");
    });
    it("getState корректно возвращает начальное значение, переданное вторым параметром при вызове createStore", () => {
        const initialState = { testState: 1 };
        const reducer = () => ({ testState: 1 });
        const store = index_1.createStore(reducer, initialState);
        const res = store.getState();
        chai_1.expect(res).to.eql(initialState);
    });
    it("после вызова dispatch в store кладутся данные, возвращаемые редюсером", () => {
        const initialState = {};
        const reducer = () => ({ testState: 2 });
        const store = index_1.createStore(reducer, initialState);
        const action = {};
        store.dispatch(action);
        const res = store.getState();
        chai_1.expect(res).to.eql({ testState: 2 });
    });
    it("коллбэк-функция, переданная в параметрах метода subscribe, исполняется при вызове dispatch", (done) => {
        const initialState = {};
        const reducer = () => ({});
        const store = index_1.createStore(reducer, initialState);
        const action = {};
        const callback = () => { done(); };
        store.subscribe(callback);
        store.dispatch(action);
    });
    it("коллбэк-функция, переданная в параметрах метода unsubscribe, перестает исполняться при вызове dispatch", () => {
        const initialState = {};
        const reducer = () => ({});
        const store = index_1.createStore(reducer, initialState);
        const action = {};
        const callback = () => { chai_1.expect.fail(); };
        store.subscribe(callback);
        store.unsubscribe(callback);
        store.dispatch(action);
    });
});
