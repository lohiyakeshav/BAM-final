import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Zerodha-inspired colors
				zerodha: {
					blue: '#387ed1',
					lightBg: '#f1f1f1',
					darkBg: '#1c1c1c',
					lightText: '#1c1c1c',
					darkText: '#ffffff',
					lightAccent: '#e6e6e6',
					darkAccent: '#2a2e35',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-10px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				// Loader animations
				'ball': {
					'0%': { transform: 'translate(0, 0)' },
					'5%': { transform: 'translate(8px, -14px)' },
					'10%': { transform: 'translate(15px, -10px)' },
					'17%': { transform: 'translate(23px, -24px)' },
					'20%': { transform: 'translate(30px, -20px)' },
					'27%': { transform: 'translate(38px, -34px)' },
					'30%': { transform: 'translate(45px, -30px)' },
					'37%': { transform: 'translate(53px, -44px)' },
					'40%': { transform: 'translate(60px, -40px)' },
					'50%': { transform: 'translate(60px, 0)' },
					'57%': { transform: 'translate(53px, -14px)' },
					'60%': { transform: 'translate(45px, -10px)' },
					'67%': { transform: 'translate(37px, -24px)' },
					'70%': { transform: 'translate(30px, -20px)' },
					'77%': { transform: 'translate(22px, -34px)' },
					'80%': { transform: 'translate(15px, -30px)' },
					'87%': { transform: 'translate(7px, -44px)' },
					'90%': { transform: 'translate(0, -40px)' },
					'100%': { transform: 'translate(0, 0)' }
				},
				'barUp1': {
					'0%': { transform: 'scale(1, 0.2)' },
					'40%': { transform: 'scale(1, 0.2)' },
					'50%': { transform: 'scale(1, 1)' },
					'90%': { transform: 'scale(1, 1)' },
					'100%': { transform: 'scale(1, 0.2)' }
				},
				'barUp2': {
					'0%': { transform: 'scale(1, 0.4)' },
					'40%': { transform: 'scale(1, 0.4)' },
					'50%': { transform: 'scale(1, 0.8)' },
					'90%': { transform: 'scale(1, 0.8)' },
					'100%': { transform: 'scale(1, 0.4)' }
				},
				'barUp3': {
					'0%': { transform: 'scale(1, 0.6)' },
					'100%': { transform: 'scale(1, 0.6)' }
				},
				'barUp4': {
					'0%': { transform: 'scale(1, 0.8)' },
					'40%': { transform: 'scale(1, 0.8)' },
					'50%': { transform: 'scale(1, 0.4)' },
					'90%': { transform: 'scale(1, 0.4)' },
					'100%': { transform: 'scale(1, 0.8)' }
				},
				'barUp5': {
					'0%': { transform: 'scale(1, 1)' },
					'40%': { transform: 'scale(1, 1)' },
					'50%': { transform: 'scale(1, 0.2)' },
					'90%': { transform: 'scale(1, 0.2)' },
					'100%': { transform: 'scale(1, 1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				// Loader animations
				'ball': 'ball 4s infinite',
				'barUp1': 'barUp1 4s infinite',
				'barUp2': 'barUp2 4s infinite',
				'barUp3': 'barUp3 4s infinite',
				'barUp4': 'barUp4 4s infinite',
				'barUp5': 'barUp5 4s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
