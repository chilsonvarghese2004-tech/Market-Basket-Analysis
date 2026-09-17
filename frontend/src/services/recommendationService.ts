import { AssociationRule, ProductRecommendation } from '../types';

export class RecommendationService {
  /**
   * Find product recommendations when a user buys a specific item
   */
  public static getRecommendationsForProduct(
    productName: string,
    rules: AssociationRule[]
  ): ProductRecommendation[] {
    const p = productName.toLowerCase().trim();
    const matches: ProductRecommendation[] = [];

    rules.forEach((rule) => {
      const isAntecedent = rule.antecedent.some((item) => item.toLowerCase() === p);
      if (isAntecedent) {
        rule.consequent.forEach((targetProduct) => {
          if (targetProduct.toLowerCase() !== p) {
            matches.push({
              product: targetProduct,
              confidence: rule.confidence,
              lift: rule.lift,
              support: rule.support,
              cooccurrences: rule.transactionCount,
              reason: rule.explanation,
              actionableStrategy: rule.businessInsight,
              category: rule.category || 'Retail',
              bundleDiscountSuggested: rule.lift > 3.0 ? '12% Bundle Savings' : '8% Pair Discount',
            });
          }
        });
      }
    });

    // Deduplicate by target product and sort by lift desc
    const uniqueMap = new Map<string, ProductRecommendation>();
    matches.forEach((rec) => {
      const existing = uniqueMap.get(rec.product);
      if (!existing || rec.lift > existing.lift) {
        uniqueMap.set(rec.product, rec);
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => b.lift - a.lift);
  }

  /**
   * Simulate recommendations for a multi-item basket
   */
  public static getBasketRecommendations(
    basket: string[],
    rules: AssociationRule[]
  ): { recommendations: ProductRecommendation[]; estimatedUpliftPercent: number; matchedRulesCount: number } {
    if (!basket.length) {
      return { recommendations: [], estimatedUpliftPercent: 0, matchedRulesCount: 0 };
    }

    const lowerBasket = basket.map((item) => item.toLowerCase().trim());
    const candidates = new Map<string, ProductRecommendation>();
    let matchedRulesCount = 0;
    let maxLift = 1.0;

    rules.forEach((rule) => {
      // Check if any rule antecedent is in the basket
      const hasOverlap = rule.antecedent.some((a) => lowerBasket.includes(a.toLowerCase()));
      if (hasOverlap) {
        matchedRulesCount++;
        if (rule.lift > maxLift) maxLift = rule.lift;

        rule.consequent.forEach((cons) => {
          // Do not recommend something already in the basket
          if (!lowerBasket.includes(cons.toLowerCase())) {
            const existing = candidates.get(cons);
            if (!existing || rule.lift > existing.lift) {
              candidates.set(cons, {
                product: cons,
                confidence: rule.confidence,
                lift: rule.lift,
                support: rule.support,
                cooccurrences: rule.transactionCount,
                reason: rule.explanation,
                actionableStrategy: rule.crossSellAction,
                category: rule.category || 'Merchandise',
                bundleDiscountSuggested: rule.lift > 3.5 ? '15% Checkout Special' : '10% Cart Bonus',
              });
            }
          }
        });
      }
    });

    const recommendations = Array.from(candidates.values()).sort((a, b) => b.lift - a.lift);
    // Estimated basket uplift percentage calculated from matched rule confidence & lift
    const estimatedUpliftPercent = Math.min(48, Math.round((maxLift - 1) * 9.5 + basket.length * 3.2));

    return {
      recommendations,
      estimatedUpliftPercent: Math.max(5, estimatedUpliftPercent),
      matchedRulesCount,
    };
  }
}

