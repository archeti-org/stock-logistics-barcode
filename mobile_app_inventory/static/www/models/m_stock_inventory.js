"use strict";
angular.module('mobile_app_inventory').factory(
        'StockInventoryModel', [
        '$q', '$rootScope', 'jsonRpc',
        function ($q, $rootScope, jsonRpc) {

    var inventory_list = null;

    return {
        get_list: function(force=false) {
            if (force){
                inventory_list = null;
            }
            inventory_list = inventory_list || jsonRpc.searchRead(
                    'stock.inventory', [['state', '=', 'confirm'], ['mobile_available', '=', true]], [
                    'id', 'name', 'date', 'inventory_line_qty',
                    ]).then(function (res) {
                console.log(res);
                return res.records;
            });
            return inventory_list;
        },

        get_inventory: function(id) {
            return this.get_list().then(function (invs) {
                var found = false;
                invs.some(function(i)  {
                    if (i.id != id)
                        return false;
                    found = i;
                    return;
                });
                return found || $q.reject('Inventory not found');
            });
        },

        CreateInventory: function(name) {
            //TODO Add the return value to the inventory_list
            return jsonRpc.call('stock.inventory', 'mobile_create', [name]);
        },

        AddInventoryLine: function(inventoryId, locationId, productId, quantity, mode) {
            return jsonRpc.call(
                    'stock.inventory', 'add_inventory_line_by_scan',
                    [inventoryId, locationId, productId, quantity, mode]).then(function (res) {
                return res;
            });
        },

    };
}]);
