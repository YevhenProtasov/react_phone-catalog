import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SearchParamsValue } from '../../types/SearchParamsValue';
import { AUTOCOMPLETE_DELAY } from '../../constants';
import { debounce } from '../../utils/debounce';
import { Category } from '../../types/Category';
import { useTranslation } from 'react-i18next';
import { TRANSLATIONS } from '../../utils/i18n/translations';

export const Search = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();

  const category = location.pathname.split('/')[1];
  const query = searchParams.get(SearchParamsValue.QUERY) || '';

  useEffect(() => {
    if (query !== searchQuery.toLowerCase().trim()) {
      setSearchQuery(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const toggleSearch = () => {
    setIsSearchOpen(true);
    searchInput.current?.focus();
  };

  const handleAppliedSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set(SearchParamsValue.PAGE, '1');
    params.delete(SearchParamsValue.PAGE);

    if (value === '') {
      params.delete(SearchParamsValue.QUERY);
    } else {
      params.set(SearchParamsValue.QUERY, value);
    }

    setSearchParams(params);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applySearch = useCallback(
    debounce(handleAppliedSearch, AUTOCOMPLETE_DELAY),
    [],
  );

  const handleSearch = (value: string) => {
    const cleanValue = value.toLowerCase().trim();

    setSearchQuery(value);
    applySearch(cleanValue);
  };

  const handleSearchBlur = () => {
    if (!query) {
      setIsSearchOpen(false);
    }
  };

  const showSearch =
    location.pathname === `/${Category.PHONES}` ||
    location.pathname === `/${Category.TABLETS}` ||
    location.pathname === `/${Category.ACCESSORIES}`;

  const PLACEHOLDER_CATEGORY = {
    [Category.PHONES]: t(TRANSLATIONS.header.actions.search.phones),
    [Category.TABLETS]: t(TRANSLATIONS.header.actions.search.tablets),
    [Category.ACCESSORIES]: t(TRANSLATIONS.header.actions.search.accessories),
  };

  return (
    <div
      className={classNames('btn btn--menu search', {
        'search--active': isSearchOpen,
        'search--hide': !showSearch,
      })}
      onClick={() => toggleSearch()}
    >
      <input
        ref={searchInput}
        type="text"
        className={classNames('search__input', {
          'search__input--active': isSearchOpen,
        })}
        placeholder={t(TRANSLATIONS.header.actions.search.placeholder, {
          category: PLACEHOLDER_CATEGORY[category as Category],
        })}
        value={searchQuery}
        onChange={e => handleSearch(e.target.value)}
        onFocus={() => setIsSearchOpen(true)}
        onBlur={() => handleSearchBlur()}
        aria-label={t(TRANSLATIONS.header.actions.search.ariaLabel)}
      />
    </div>
  );
};