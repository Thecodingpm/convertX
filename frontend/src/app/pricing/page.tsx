import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
    title: "Pricing – FileForge",
    description: "Simple, transparent pricing for FileForge file conversion tools.",
};

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Basic file conversion for everyone",
        features: [
            "All basic conversion tools",
            "5 conversions per day",
            "Max 25MB file size",
            "Standard processing speed",
            "Community support",
        ],
        cta: "Get started free",
        href: "/register",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$9.99",
        period: "/month",
        description: "Unlimited conversions for professionals",
        features: [
            "All conversion tools",
            "Unlimited conversions",
            "Max 500MB file size",
            "Priority processing",
            "Batch conversion",
            "API access",
            "No advertisements",
            "Priority support",
        ],
        cta: "Upgrade to Pro",
        href: "/register",
        highlighted: true,
    },
];

export default function PricingPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.header}>
                    <h1>Simple, transparent pricing</h1>
                    <p>Start converting files for free. Upgrade when you need more.</p>
                </div>

                <div className={styles.grid}>
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`${styles.card} ${plan.highlighted ? styles.cardHighlighted : ""
                                }`}
                        >
                            {plan.highlighted && (
                                <div className={styles.popularBadge}>Most Popular</div>
                            )}
                            <h2>{plan.name}</h2>
                            <div className={styles.price}>
                                <span className={styles.amount}>{plan.price}</span>
                                <span className={styles.period}>{plan.period}</span>
                            </div>
                            <p className={styles.description}>{plan.description}</p>
                            <Link href={plan.href} className={`btn ${plan.highlighted ? "btn-primary" : "btn-secondary"} btn-lg`} style={{ width: "100%" }}>
                                {plan.cta}
                            </Link>
                            <ul className={styles.features}>
                                {plan.features.map((f) => (
                                    <li key={f}>
                                        <span className={styles.check}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
