export function calculateDynamicPrice(listing, date) {
  if (!listing.pricing || !listing.pricing.basePrice) {
    return { price: listing.price || 1000, isWeekend: false, seasonalMultiplier: 1, demandMultiplier: 1 };
  }
  let price = listing.pricing.basePrice;
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const weekendMultiplier = isWeekend ? listing.pricing.weekendMultiplier : 1;

  let seasonalMultiplier = 1;
  if (listing.pricing.seasonalPricing.length) {
    listing.pricing.seasonalPricing.forEach(season => {
      if (date >= season.startDate && date <= season.endDate) {
        seasonalMultiplier = season.multiplier;
      }
    });
  }

  const demandMultiplier = listing.pricing.demandBased?.enabled ? listing.pricing.demandBased.multiplier : 1;

  price = price * weekendMultiplier * seasonalMultiplier * demandMultiplier;

  return { price: Number(price) }; // ensure it's a number
}
