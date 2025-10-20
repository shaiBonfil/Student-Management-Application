import { useState, useEffect, useRef, type FC } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
    value: number;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: number;
    onChange: (value: number) => void;
}

const Select: FC<SelectProps> = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: number) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={styles.customSelectContainer} ref={selectRef}>
            <button
                type='button'
                className={styles.selectButton}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : ''}</span>
                <span
                    className={`${styles.selectArrow} ${
                        isOpen && styles.selectArrowOpen
                    }`}
                >
                    <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                    >
                        <path
                            d='M5.83333 7.5L10 11.6667L14.1667 7.5'
                            stroke='#6B7280'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <ul className={styles.optionsList}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={styles.optionItem}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;
