
/**
 * ⚡ Modal Synapse Logic
 * "The Gatekeeper of Necessity"
 * Implements Modal Logic operators: Necessary (⬜) and Possible (◇).
 */

export enum ModalOperator {
    NECESSARY = "⬜",
    POSSIBLE = "◇"
}

export interface SynapsePulse {
    operator: ModalOperator;
    proposition: string;
    velocity: number;
}

export class ModalSynapse {
    constructor() {
        console.log('⚡ [MODAL_SYNAPSE]: Logic Gates Primed.');
    }

    /**
     * Collapses a possibility (◇) into a necessity (⬜) based on entropy pressure.
     */
    public resolve(pulse: SynapsePulse): SynapsePulse {
        if (pulse.operator === ModalOperator.POSSIBLE && pulse.velocity > 0.888) {
            console.log(`⚡ [MODAL_SYNAPSE]: Transitioning ◇ ${pulse.proposition} -> ⬜ NECESSITY.`);
            return {
                ...pulse,
                operator: ModalOperator.NECESSARY
            };
        }
        return pulse;
    }
}
