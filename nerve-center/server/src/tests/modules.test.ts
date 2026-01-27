
import { MetaLogicEngine } from '../engines/MetaLogicEngine';
import { OntoGenerator } from '../engines/OntoGenerator';

describe('Nerve-Center Modules', () => {
    let metaLogic: MetaLogicEngine;
    let onto: OntoGenerator;

    beforeEach(() => {
        metaLogic = new MetaLogicEngine();
        onto = new OntoGenerator();
    });

    test('MetaLogicEngine validates proposition', () => {
        expect(metaLogic.validateLogic({ axiom: 'identity' })).toBe(true);
    });

    test('MetaLogicEngine synthesizes rule', () => {
        expect(metaLogic.synthesizeRule({})).toContain('RULE_AXIOM_1');
    });

    test('OntoGenerator creates ontology', () => {
        const result = onto.generateOntology('Testing');
        expect(result.domain).toBe('Testing');
        expect(result.concepts).toContain('Entity');
    });
});
