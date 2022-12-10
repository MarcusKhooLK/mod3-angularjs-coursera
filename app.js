(function(){
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController',NarrowItDownController)
    .controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItems)

    function FoundItems() {
        const ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            },
            controller: 'FoundItemsDirectiveController as ctrl',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        const ctrl = this;
    }

    NarrowItDownController.$inject = ['MenuSearchService']
    function NarrowItDownController(MenuSearchService) {
        const ctrl = this;
        ctrl.searchTerm = '';
        ctrl.search = function() {
            ctrl.promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
            .then(function (response) {
                ctrl.found = response;
            })
            .catch(function (error) {
                console.error(error);
            })
        }

        ctrl.onRemove = function(index) {
            ctrl.found.splice(index, 1);
        }
    }

    MenuSearchService.$inject = ['$http']
    function MenuSearchService($http) {
        const svc = this;

        svc.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: 'GET',
                url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
            }).then(function (result) {
                const foundItems = [];
                for(const key in result.data) {
                    const category = result.data[key];
                    for(const subKey in category.menu_items) {
                        const menuItem = category.menu_items[subKey];
                        if(menuItem.description.includes(searchTerm)) {
                            foundItems.push({
                                name: menuItem.name,
                                shortName: menuItem.short_name,
                                description: menuItem.description
                            })
                        }
                    }
                }
                return foundItems;
            }, function(error) {
                console.error(error)
            })
        }
    }
})();