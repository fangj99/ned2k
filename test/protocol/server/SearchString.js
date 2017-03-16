const assert = require('assert');
const SearchString = require('../../../lib/protocol/server/SearchString');
const inspect = require('util').inspect;

describe('search string test', () => {
    const str = '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall';
    const tree = {
        command: 'NOT',
        'NOT': {
            left: {
                command: 'AND',
                'AND': {
                    left: {
                        value: 'HelloWorld',
                        left: null,
                        right: null
                    },
                    right: {
                        command: 'AND',
                        'AND': {
                            left: {
                                command: 'OR',
                                'OR': {
                                    left: {
                                        value: 'You',
                                        left: null,
                                        right: null
                                    },
                                    right: {
                                        value: 'Me',
                                        left: null,
                                        right: null
                                    }
                                }
                            },
                            right: {
                                value: 'Best',
                                left: null,
                                right: null
                            }
                        }
                    }
                }
            },
            right: {
                value: 'andycall',
                left: null,
                right: null
            }
        } 
    }

    const strGroup = [
        [
            'HelloWorld OR Andycall',
            'ORHelloWorldAndycall'
        ],
        [
            '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall',
            'NOTANDHelloWorldANDORYouMeBestandycall'
        ],
        [
            'andycall NOT (HelloWorld AND ((You OR Me) AND Best))',
            'NOTandycallANDHelloWorldANDORYouMeBest'
        ],
        [
            '(Hello AND ((AAAANDBBB OR CCCCOREEEE) NOT XXXXXX)) AND (OOOOEEX AND ORORBest)',
            'ANDANDHelloNOTORAAAANDBBBCCCCOREEEEXXXXXXANDOOOOEEXORORBest'
        ]
    ]
    
    it('# formatSearchString', () => {
        let formatTestCase = [
            [
                '(HelloWorld AND ((You OR Me) AND Best)) NOT andycall',
                ['HelloWorld AND ((You OR Me) AND Best)', 'NOT', 'andycall']
            ],
            [
                'OOOOEEX AND ORORBest',
                ['OOOOEEX', 'AND', 'ORORBest']
            ],
            [
                'NOTA AND XXXORXXNOT',
                ['NOTA', 'AND', 'XXXORXXNOT']
            ],
            [
                'AAAANDBBB OR CCCCOREEEE',
                ['AAAANDBBB', 'OR', 'CCCCOREEEE']
            ]
        ];

        formatTestCase.forEach(item => {
            let str = item[0];
            let result = item[1];
            
            let search = new SearchString(str);
            let group = search.formatSearchString(str);
            assert.deepEqual(group, result);
        });
    });

    it('# generate binary tree', () => {
        let search = new SearchString(str);
        let binaryTree = search.buildSearchTree(str);

        assert.deepEqual(binaryTree, tree);
    });

    it('# get Formated SearchString', () => {
        let search = new SearchString(str);
        let searchResult = search.printFormatedString();
        let result = 'NOTANDHelloWorldANDORYouMeBestandycall';
        assert.equal(searchResult, result);
    });

    it('# str group test', () => {
        strGroup.forEach(item => {
            let search = new SearchString(item[0]);
            let searchResult = search.printFormatedString();
            
            assert.equal(searchResult, item[1]);
        });
    });
});