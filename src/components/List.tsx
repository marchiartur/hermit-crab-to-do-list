import React from 'react';

type ListProps = {
  data: any[];
  renderItem: (item: any, index: number) => JSX.Element;
};

const List = ({ data, renderItem }: ListProps) => {
  return <>{data?.map(renderItem)}</>;
};

export default List;
