import {describe, expect, it} from 'vitest';
import {render, screen} from '@/shared/util/test-utils';
import {Input} from '../input';

describe('Input 프리미티브', () => {
    it('foundation variant와 lg size를 조합할 수 있어야 함', () => {
        render(<Input variant="foundation" fieldSize="lg" aria-label="foundation-input" />);

        expect(screen.getByLabelText('foundation-input')).toHaveClass('rounded-[10px]', 'border-gray-5', 'h-11');
    });
});
