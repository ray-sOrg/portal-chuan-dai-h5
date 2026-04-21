import { getTranslations } from "next-intl/server";
import { Heart, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { signInPath } from "@/paths";
import { getPersonalRecommendations } from "../queries/get-personal-recommendations";

export async function PersonalRecommendations() {
  const t = await getTranslations();
  const { isLoggedIn, favorites, recommendations } =
    await getPersonalRecommendations();

  return (
    <section className="card-base p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="w-5 h-5 text-primary" />
          </span>
          {t("home.personalRecommend.title")}
        </h3>
      </div>

      {!isLoggedIn ? (
        <div className="text-center py-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">
            {t("home.personalRecommend.loginTip")}
          </p>
          <Link
            href={signInPath}
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            {t("auth.signIn")}
          </Link>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Heart className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {t("home.personalRecommend.noFavorites")}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            {t("home.personalRecommend.basedOnFavorites")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(recommendations.length > 0 ? recommendations : favorites)
              .slice(0, 4)
              .map((dish) => (
                <div
                  key={dish.id}
                  className="overflow-hidden rounded-[calc(var(--radius)-0.05rem)] border border-border/80 bg-[var(--surface-soft)] shadow-[var(--shadow-soft)]"
                >
                  <div className="aspect-square bg-[linear-gradient(145deg,var(--hero-start),var(--hero-end))] flex items-center justify-center">
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "🍜"
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-sm truncate">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {dish.description}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-muted-foreground text-xs truncate">
                        {dish.isSpicy ? '🌶️' : ''}{dish.isVegetarian ? '🥬' : ''}
                      </span>
                      <button className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
