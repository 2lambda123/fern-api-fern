import { EditorItemIdGenerator } from "@fern-api/editor-item-id-generator";
import { TransactionGenerator } from "@fern-api/transaction-generator";
import { FernApiEditor } from "@fern-fern/api-editor-sdk";
import { MockApi } from "../../../testing-utils/mocks/MockApi";

describe("SetObjectExtensionTypeTransactionHandler", () => {
    it("correctly sets extension", () => {
        const api = new MockApi();
        const package_ = api.addPackage();
        const first = package_.addObject();
        const second = package_.addObject();
        const third = package_.addObject();

        const extensionId = EditorItemIdGenerator.objectExtension();
        api.applyTransaction(
            TransactionGenerator.createObjectExtension({
                objectId: second.typeId,
                extensionId,
                extensionOf: first.typeId,
            })
        );

        const transaction = TransactionGenerator.setObjectExtensionType({
            objectId: second.typeId,
            extensionId,
            extensionOf: third.typeId,
        });
        api.applyTransaction(transaction);

        const object = api.definition.types[second.typeId];
        if (object?.shape.type !== "object") {
            throw new Error("Type is not an object");
        }
        expect(object.shape.extensions[0]?.extensionOf).toEqual(third.typeId);
    });

    it("throws when object does not exist", () => {
        const api = new MockApi();
        const package_ = api.addPackage();
        const first = package_.addObject();
        const second = package_.addObject();
        const third = package_.addObject();

        const extensionId = EditorItemIdGenerator.objectExtension();
        api.applyTransaction(
            TransactionGenerator.createObjectExtension({
                objectId: second.typeId,
                extensionId,
                extensionOf: first.typeId,
            })
        );

        const transaction = TransactionGenerator.setObjectExtensionType({
            objectId: "made-up-id" as FernApiEditor.TypeId,
            extensionId,
            extensionOf: third.typeId,
        });

        expect(() => api.applyTransaction(transaction)).toThrow();
    });

    it("throws when extension being edited does not exist", () => {
        const api = new MockApi();
        const package_ = api.addPackage();
        const first = package_.addObject();
        const second = package_.addObject();

        const transaction = TransactionGenerator.setObjectExtensionType({
            objectId: second.typeId,
            extensionId: "made-up-id" as FernApiEditor.ObjectExtensionId,
            extensionOf: first.typeId,
        });

        expect(() => api.applyTransaction(transaction)).toThrow();
    });

    it("throws when extensionOf does not exist", () => {
        const api = new MockApi();
        const package_ = api.addPackage();
        const first = package_.addObject();
        const second = package_.addObject();

        const extensionId = EditorItemIdGenerator.objectExtension();

        api.applyTransaction(
            TransactionGenerator.createObjectExtension({
                objectId: second.typeId,
                extensionId,
                extensionOf: first.typeId,
            })
        );

        const transaction = TransactionGenerator.setObjectExtensionType({
            objectId: second.typeId,
            extensionId,
            extensionOf: "made-up-id" as FernApiEditor.TypeId,
        });

        expect(() => api.applyTransaction(transaction)).toThrow();
    });
});
