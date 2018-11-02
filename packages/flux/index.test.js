"use strict";
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-empty */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("./index");
describe("createStore", () => {
    it("getState возвращает undefined при отсутствии второго параметра при инициализации store", () => {
        const reducer = () => { };
        const store = index_1.createStore(reducer);
        const res = store.getState();
        chai_1.expect(res).to.be.undefined;
    });
    it("getState корректно возвращает начальное значение, переданное вторым параметром при инициализации store", () => {
        const initialState = { testState: 1 };
        const reducer = () => ({ testState: 1 });
        const store = index_1.createStore(reducer, initialState);
        const res = store.getState();
        chai_1.expect(res).to.eql(initialState);
    });
    it("после выполнения функции dispatch в store кладутся данные, возвращаемые редюсером", () => {
        const reducer = () => ({ testState: 2 });
        const store = index_1.createStore(reducer);
        const action = {};
        store.dispatch(action);
        const res = store.getState();
        chai_1.expect(res).to.eql({ testState: 2 });
    });
    it("при изменение store срабатывает колбэк функция, переданная в качестве параметра в функцию subscribe", () => {
        const reducer = () => { };
        const store = index_1.createStore(reducer);
        const action = {};
        let counter = 0;
        const increaseCounter = () => { counter += 1; };
        store.subscribe(increaseCounter);
        store.dispatch(action);
        chai_1.expect(counter).to.equal(1);
    });
});
